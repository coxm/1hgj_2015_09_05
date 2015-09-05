// vim: noet sts=4 ts=4 sw=4
module jam {

const DEG_TO_RAD: number = Math.PI / 180;


function setVelocity(sprite: Phaser.Sprite, speed: number): void {
	var angle: number = DEG_TO_RAD * (sprite.angle - 90);
	sprite.body.velocity.x = speed * Math.cos(angle);
	sprite.body.velocity.y = speed * Math.sin(angle);
}



export class State extends Phaser.State {
	button = {
		pressed: false,
		timeout: 0
	};

	cursors: Phaser.CursorKeys = null;

	player: Phaser.Sprite = null;

	enemies: Phaser.Group = null;

	enemyCounter: number = settings.enemies.timeout;

	preload(): void {
		this.game.load.spritesheet('player', 'img/player.png', 64, 64);
		this.game.load.spritesheet('enemy', 'img/enemy.png', 64, 64);
	}

	create(): void {
		var game: Phaser.Game = this.game;
		game.stage.backgroundColor = settings.viewport.backgroundColour;

		game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN
		]);

		this.button = {
			pressed: false,
			timeout: 0
		};

		this.cursors = game.input.keyboard.createCursorKeys();

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.player = game.add.sprite(
			settings.viewport.width / 2,
			settings.viewport.height / 2,
			'player'
		);
		this.player.animations.add('normal', [0], 15, false);
		game.physics.arcade.enable(this.player);
		this.player.body.debug = settings.debug;

		this.player.health = 100;

		this.enemies = this.game.add.group(
			this.game.world, // parent
			'enemies', // name
			false, // addToStage
			true, // enableBody
			Phaser.Physics.ARCADE // body type
		);

		$('button').click((ev: JQueryEventObject): void => {
			if (this.button.timeout <= 0) {
				this.button.pressed = true;
				this.button.timeout = settings.button.timeout;
				console.log('got a button press!');
				$(ev.target).prop('disabled', true);
			}
			else {
				console.log('pressing button does nothing while timing out');
			}
		});
	}

	update(): void {
		--this.enemyCounter;
		this.button.timeout = Math.max(this.button.timeout - 1, 0);

		if (this.button.timeout <= 0) {
			$('button').prop('disabled', false);
		}

		if (this.enemyCounter <= 0) {
			this.addEnemy();
			this.enemyCounter = settings.enemies.timeout;
		}

		if (this.button.timeout === 0) {
			if (this.cursors.left.isDown) {
				this.player.body.velocity.x = -settings.player.moveSpeed;
			}
			else if (this.cursors.right.isDown) {
				this.player.body.velocity.x = settings.player.moveSpeed;
			}
			else {
				this.player.body.velocity.x = 0;
			}

			if (this.cursors.up.isDown) {
				this.player.body.velocity.y = -settings.player.moveSpeed;
			}
			else if (this.cursors.down.isDown) {
				this.player.body.velocity.y = settings.player.moveSpeed;
			}
			else {
				this.player.body.velocity.y = 0;
			}
		}

		this.enemies.forEach((e: Phaser.Sprite): void => {
			var velx: number = 0,
				vely: number = 0;

			if (e.x > this.player.x) {
				velx = -settings.enemies.xSpeed;
			}
			else if (e.x < this.player.x) {
				velx = settings.enemies.xSpeed;
			}
			else {
				velx = 0;
			}

			if (e.y > this.player.y) {
				vely = -settings.enemies.ySpeed;
			}
			else if (e.y < this.player.y) {
				vely = settings.enemies.ySpeed;
			}
			else {
				vely = 0;
			}

			e.body.velocity.x = velx;
			e.body.velocity.y = vely;

			if (dist(this.player, e) < settings.enemies.killRadius) {
				--this.player.health;
			}
		}, null);

		$('#health').text('Health: ' + this.player.health);
		if (this.player.health <= 0) {
			this.game.paused = true;
			$('#health').text('You died');
		}

		if (this.button.pressed) {
			console.log('button pressed!');
			this.buttonKill();
			this.button.pressed = false;
			this.button.timeout = settings.button.timeout;
		}
	}

	buttonKill(): void {
		this.enemies.forEach((e: Phaser.Sprite): void => {
			const d: number = dist(this.player, e);
			console.log('enemy distance', d);
			if (d < settings.button.deathRadius) {
				console.log('killing! dist', d);
				e.kill();
			}
			else {
				console.log('not killing: dist', d);
			}
		}, this);
	}

	addEnemy(): void {
		if (this.enemies.length >= settings.enemies.max) {
			console.log('not adding enemy (hit max)');
			return;
		}
		this.enemyCounter = settings.enemies.timeout;

		var sprite = this.game.add.sprite(
			randInt(0, settings.viewport.width),
			randInt(0, settings.viewport.height),
			'enemy'
		);
		this.enemies.add(sprite);
		sprite.animations.add('normal', [0], 15, false);
		sprite.animations.play('normal');
		console.log('added enemy');
	}

	render(): void {
	}
}

} // module jam
