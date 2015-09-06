// vim: noet sts=4 ts=4 sw=4
module jam {

export var settings = {
	debug: true,

	viewport: {
		backgroundColour: '#666',
		width: 800,
		height: 600
	},

	button: {
		timeout: 150,
		deathRadius: 120
	},

	player: {
		moveSpeed: 300
	},

	enemies: {
		max: 20,
		timeout: 240,

		minTimeout: 10,
		killDecrease: 20,
		createDecrease: 5,

		xSpeed: 30,
		ySpeed: 30,

		killRadius: 30
	}
};

} // module jam
