var express = require('express')
var router = express.Router();

const fs = require('fs');

const Services = require('./services');

let SERIES_CALC = JSON.parse(fs.readFileSync('assets/seriescalc_50-001231_8-276251.json'));
const {db, pgp} = require("./db");

var axios = require('axios');
axios.defaults.withCredentials = true;

var GeographicLib = require("geographiclib"),
    geod = GeographicLib.Geodesic.WGS84, r;

router.get('/', function (req, res) {

	if(req.session.local) {

 		var query = `SELECT * FROM projects WHERE projects.branch = 'Shipping'`;

		return pgp.any(query).then(result => {
			return res.json(result);
		}).catch(error => {
			console.log(error);
			return res.status(501).send('Error');
		});

	} else {
		return res.status(401).send('Not authorized');
	}

})


router.get('/sensors', function (req, res) {

    const model =  req.query.model;
    const ref = req.query.ref || '';
    const location = req.query.location;

	console.log(req.query);

    pgp.any(`SELECT * FROM sensors WHERE model = $1 AND location = $2 AND ref = $3 ORDER BY created_at DESC LIMIT 6000`, [model, location, ref])
    .then(data => {
        res.json(data);
    }).catch((error) => {
        console.log(error);
        res.status(500).send('sensors Error!');
    })  
});

router.get('/month-average', function (req, res) {

	const model = req.query.model || '';
	const ref = req.query.ref || '';
	const location = req.query.location; //req.query.location
	const start = parseInt(req.query.start); //req.query.start
	const end = parseInt(req.query.end) || parseInt(new Date()/1000); //req.query.start
	const datepart = req.query.datepart || 'minute';

	//res.set('Cache-Control', 'public, max-age=3600'); 
	pgp.any(`SELECT (date_trunc($4, created_at))::time as timestamp, AVG((payload->'irr')::numeric) as avg FROM sensors 
		WHERE model = $1 AND location = $2 AND ref = $5 AND created_at > date_trunc('month', to_timestamp($3) ) 
		GROUP BY 1 ORDER BY timestamp ASC`, [model, location, start, datepart, ref])
	    .then(data => {
			res.json(data)
	    }).catch((error) => {
			console.log(error);
			res.status(500).send('monthAverage Error!');
		})	

});


router.get('/date-trunc', function (req, res) {



        const model =  req.query.model;
        const ref = req.query.ref || '';
        const location = req.query.location; //req.query.location
        const start = parseInt(req.query.start); //req.query.start
        const end = parseInt(req.query.end) || parseInt(new Date()/1000); //req.query.start
        const datepart = req.query.datepart || 'day';

        console.log(req.query);

        const quey = `WITH row_power AS (
		    SELECT
		        created_at,

		        -- PV phases in W
		        ((payload->'pv'->'power')->>0)::float8 AS pv_p1_w,
		        ((payload->'pv'->'power')->>1)::float8 AS pv_p2_w,
		        ((payload->'pv'->'power')->>2)::float8 AS pv_p3_w,

		        -- Grid phases in W
		        ((payload->'grid'->'power')->>0)::float8 AS grid_p1_w,
		        ((payload->'grid'->'power')->>1)::float8 AS grid_p2_w,
		        ((payload->'grid'->'power')->>2)::float8 AS grid_p3_w

		    FROM sensors
		    WHERE location = 'TULA'
		      AND model    = 'GRID+PV'
		      AND created_at >= to_timestamp($1)
		),

		daily_phase AS (
		    SELECT
		        date_trunc($2, created_at) AS day,

		        -- PV per phase (kWh)
		        sum(pv_p1_w) * (5.0 / 3600000.0) AS pv_p1_kwh,
		        sum(pv_p2_w) * (5.0 / 3600000.0) AS pv_p2_kwh,
		        sum(pv_p3_w) * (5.0 / 3600000.0) AS pv_p3_kwh,

		        -- Grid per phase (kWh)
		        sum(grid_p1_w) * (5.0 / 3600000.0) AS grid_p1_kwh,
		        sum(grid_p2_w) * (5.0 / 3600000.0) AS grid_p2_kwh,
		        sum(grid_p3_w) * (5.0 / 3600000.0) AS grid_p3_kwh

		    FROM row_power
		    GROUP BY day
		)

		SELECT
		    day,

		    -- PV per phase
		    pv_p1_kwh,
		    pv_p2_kwh,
		    pv_p3_kwh,

		    -- Grid per phase
		    grid_p1_kwh,
		    grid_p2_kwh,
		    grid_p3_kwh,

		    -- Totals
		    (pv_p1_kwh + pv_p2_kwh + pv_p3_kwh)       AS pv_total_kwh,
		    (grid_p1_kwh + grid_p2_kwh + grid_p3_kwh) AS grid_total_kwh,

		    -- Net (PV minus grid)
		    (pv_p1_kwh + pv_p2_kwh + pv_p3_kwh)
		      - (grid_p1_kwh + grid_p2_kwh + grid_p3_kwh) AS net_kwh

		FROM daily_phase
		ORDER BY day;`;


        pgp.any(quey, [start, datepart])
        .then(data => {
			res.json(data);
        }).catch((error) => {
			console.log(error);
			res.status(500).send('date trunc Error!');
        })      
});


router.get('/date-trunc-sensors', function (req, res) {
	//res.set('Cache-Control', 'public, max-age=150'); 

	const rowMode = req.query.rowMode ? req.query.rowMode : 'objects';

	const model =  req.query.model;
	const ref = req.query.ref || '';
	const location = req.query.location; //req.query.location
	const start = parseInt(req.query.start); //req.query.start
	const end = parseInt(req.query.end) || parseInt(new Date()/1000); //req.query.start
	const datepart = req.query.datepart || 'minute';

	//const keys = ['part_03', 'part_05', 'part_5', 'part_10'];

	const rows = req.query.keys.map(key => `CAST (AVG((payload->'${key}')::numeric)AS DOUBLE PRECISION) as ${key}`).join(', ');

	pgp.any({text: `SELECT date_trunc($6, created_at) as timestamp, ${rows} FROM sensors 
		WHERE model = $1 AND location = $2 AND ref = $5 AND created_at > to_timestamp($3) AND created_at < to_timestamp($4)  
		GROUP BY 1 ORDER BY timestamp ASC`, values: [model, location, start, end, ref, datepart], rowMode: rowMode})
	.then(data => {
		res.json(data);
	}).catch((error) => {
		console.log(error);
		res.status(500).send('sensorsAverage Error!');
	})	
});

router.get('/weather', function(req, res) { 

	const lat = req.query.lat;
	const lon = req.query.lon;

	Services.getWeather(lat, lon).then(data => {
		res.json(data)
	}).catch(error => {
		res.status(500).send(error.message)
	})
})

router.get('/pvgis', function(req, res) {

	const lat = req.query.lat;
	const lon = req.query.lon;
	const angle = req.query.angle;
	const aspect = req.query.aspect;

	Services.getPvgis(lat, lon, angle, aspect).then(data => {
		res.json(data)
	}).catch(error => {
		res.status(500).send(error.message)
	})
});


router.get('/solcast', function(req, res) {

	const location = req.query.location;

	pgp.oneOrNone("SELECT * FROM sensors WHERE model = 'SOLCAST' AND location = $1 AND ref = '' AND type = '' AND created_at >= now()::date LIMIT 1;", [location])
	.then(data => {
		res.json(data);
	}).catch((error) => {
		console.log(error);
		res.status(500).send('sensorsAverage Error!');
	})	

});

const HATCH_POWER = 3.720; //Wp
const NUMBER_OF_HATCHES = 6;
const INSTALLED_POWER = HATCH_POWER * NUMBER_OF_HATCHES;
const IDLE_CONSUMPTION = 24*2000; //Wp


//https://re.jrc.ec.europa.eu/api/seriescalc?lat=50.001231&lon=8.276251&outputformat=json


//https://re.jrc.ec.europa.eu/api/seriescalc?lat=45&lon=8&outputformat=json
router.get('/pvgis/seriescalc', function(req, res) {


	axios.get('https://re.jrc.ec.europa.eu/api/v5_2/seriescalc?lat=50.001231&lon=8.276251&outputformat=json', {
  		params: {
		},
  		headers: {}
	}).then(result => {
		let data = JSON.stringify(result.data, null, "\t");
		fs.writeFileSync('./seriescalc_50-001231_8-276251.json', data);
		res.json(result.data)
	}).catch(error => {
		console.log(error)
		res.status(500).send(error.message)
	})

    //res.set('Content-Type', 'application/octet-stream');
    //res.set('Content-disposition', 'attachment;filename=Straling.csv');
	//res.json(result);


});

function seriescalc2day(SERIES_CALC){

	yieldPerDay = {}; 
    yieldPerDayPerYear = {}; 
    yieldAboveAverage = {};
    summary = [];

	SERIES_CALC.outputs.hourly.forEach(item => {
		const [dateValues, timeValues] = item.time.split(':');
    	    
        const year = dateValues.substr(0,4);
        const month = dateValues.substr(4,2);
        const day = dateValues.substr(6,2);
        const hours = timeValues.substr(0,2);
        const minutes = timeValues.substr(2,2);
        //const date = new Date(+year, month - 1, +day, +hours, +minutes);

        const key = `${day}/${month}/${year}`;

        if (!yieldPerDay[key]) { yieldPerDay[key] = []; }
        
        yieldPerDay[key].push( item['G(i)'] );

    });

    for (const [date, value] of Object.entries(yieldPerDay)) {
        const year = date.substr(6,4);
        const month = date.substr(3,2);
        const day = date.substr(0,2);

        const key = `${day}/${month}`;

        if (!yieldPerDayPerYear[key]) { yieldPerDayPerYear[key] = [];}

        yieldPerDayPerYear[key].push( value.reduce((acc, cur) => {return acc + cur; }, 0) );
    }

    for (const [date, value] of Object.entries(yieldPerDay)) {
        const year = date.substr(6,4);
        const month = date.substr(3,2);
        const day = date.substr(0,2);

        const key = `${day}/${month}`;

        if (!yieldAboveAverage[key]) { yieldAboveAverage[key] = [];}

        yieldAboveAverage[key].push( value.reduce((acc, cur) => {return acc + cur; }, 0) );
        //console.log(date)
        console.log(date, value.reduce((acc, cur) => {return acc + cur; }, 0))
    }

    for (const [date, value] of Object.entries(yieldAboveAverage)) {
    	
        summary.push({x: date, y: value.sort()})
    }

    return summary;
}
//seriescalc2day(SERIES_CALC)
//console.log(seriescalc2day(SERIES_CALC))


function averageDailyYieldAboveComsumption(consumption, installedPower){

    yieldPerDay = {}; 
    yieldPerDayPerYear = {}; 
    yieldAboveAverage = {};
    summary = [];

    SERIES_CALC.outputs.hourly.forEach(item => {

        const [dateValues, timeValues] = item.time.split(':');
        
        const year = dateValues.substr(0,4);
        const month = dateValues.substr(4,2);
        const day = dateValues.substr(6,2);
        const hours = timeValues.substr(0,2);
        const minutes = timeValues.substr(2,2);
        //const date = new Date(+year, month - 1, +day, +hours, +minutes);

        const key = `${day}/${month}/${year}`;

        if (!yieldPerDay[key]) { yieldPerDay[key] = []; }
        
        yieldPerDay[key].push( item['G(i)'] );
    });

    for (const [date, value] of Object.entries(yieldPerDay)) {
        const year = date.substr(6,4);
        const month = date.substr(3,2);
        const day = date.substr(0,2);

        const key = `${day}/${month}`;

        if (!yieldPerDayPerYear[key]) { yieldPerDayPerYear[key] = [];}

        yieldPerDayPerYear[key].push( value.reduce((acc, cur) => {return acc + cur; }, 0) );

        if (!yieldAboveAverage[year]) { yieldAboveAverage[year] = []; }

        yieldAboveAverage[year].push( value.reduce((acc, cur) => {return acc + cur; }, 0) * installedPower  > consumption ? 1 : 0  )
    }

    for (const [key, value] of Object.entries(yieldAboveAverage)) {
        const sum = value.reduce( (acc, cur) => { return acc + cur; }, 0);
        summary.push([key, sum]);
    }

    return summary.reduce( (acc, cur, index, array) => {
        return acc + cur[1] / array.length;
    }, 0) / 30.41;
}

module.exports = router;
