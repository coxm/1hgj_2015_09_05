// vim: noet sts=4 ts=4 sw=4
module jam {

export var state: jam.State = new jam.State();

export var game: Phaser.Game = new Phaser.Game(
	800,
	600,
	Phaser.AUTO,
	'game', // Insert into body.
	state
);

} // module jam
