const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Workout = new Schema(
	{
		day: Number,
		exercises: [
			{
				type: String,
				name: String,
				duration: Number,
				weight: Number,
				reps: Number,
				sets: Number,
				distance: Number,
			},
		],
	},
	{ typeKey: '$type' }
);

const db = {
	Workout: mongoose.model('Workout', Workout),
};

module.exports = db;
