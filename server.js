const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const db = require('./models');

const initMongo = async () => {
	await mongoose.connect(
		'mongodb+srv://admin:admin@maincluster.qkwg7.mongodb.net/gymworkouts?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		}
	);
};

initMongo();

app.use(
	express.static(path.join(__dirname, 'public'), { extensions: ['html'] })
).use(express.json());

app.get('/api/workouts', async (req, res) => {
	const workouts = await db.Workout.aggregate([
		{
			$addFields: { totalDuration: { $sum: '$exercises.duration' } },
		},
	]);
	res.send(workouts);
});

app.put('/api/workouts/:id', async (req, res) => {
	const { id } = req.params;
	const data = req.body;

	const workout = await db.Workout.findOneAndUpdate(
		{ _id: id },
		{
			$push: {
				exercises: data,
			},
		}
	);
	res.status(201).send(workout);
});

app.post('/api/workouts', async (req, res) => {
	const workout = new db.Workout({
		day: Date.now(),
		exercises: [],
	});
	workout.save();
	res.status(201).send(workout);
});

app.get('/api/workouts/range', async (req, res) => {
	const workouts = await db.Workout.aggregate([
		{ $sort: { day: -1 } },
		{ $limit: 7 },
		{
			$addFields: { totalDuration: { $sum: '$exercises.duration' } },
		},
	]);
	res.send(workouts);
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 8080);
