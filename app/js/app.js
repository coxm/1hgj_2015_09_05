var jam;
(function (jam) {
    function rangeIncl(minIncl, maxIncl) {
        var a = new Array(maxIncl - minIncl + 1), i = minIncl;
        for (; i <= maxIncl; ++i) {
            a[i] = i;
        }
        return a;
    }
    jam.rangeIncl = rangeIncl;
    function randInt(min, max) {
        return Math.random() * (max - min) + min;
    }
    jam.randInt = randInt;
    function dist(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) +
            (a.y - b.y) * (a.y - b.y));
    }
    jam.dist = dist;
})(jam || (jam = {})); // module jam
// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    jam.settings = {
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
            xSpeed: 30,
            ySpeed: 30,
            killRadius: 30
        }
    };
})(jam || (jam = {})); // module jam
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    var DEG_TO_RAD = Math.PI / 180;
    function setVelocity(sprite, speed) {
        var angle = DEG_TO_RAD * (sprite.angle - 90);
        sprite.body.velocity.x = speed * Math.cos(angle);
        sprite.body.velocity.y = speed * Math.sin(angle);
    }
    var State = (function (_super) {
        __extends(State, _super);
        function State() {
            _super.apply(this, arguments);
            this.button = {
                pressed: false,
                timeout: 0
            };
            this.cursors = null;
            this.player = null;
            this.enemies = null;
            this.enemyCounter = jam.settings.enemies.timeout;
        }
        State.prototype.preload = function () {
            this.game.load.spritesheet('player', 'img/player.png', 64, 64);
            this.game.load.spritesheet('enemy', 'img/enemy.png', 64, 64);
        };
        State.prototype.create = function () {
            var _this = this;
            var game = this.game;
            game.stage.backgroundColor = jam.settings.viewport.backgroundColour;
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
            this.player = game.add.sprite(jam.settings.viewport.width / 2, jam.settings.viewport.height / 2, 'player');
            this.player.animations.add('normal', [0], 15, false);
            game.physics.arcade.enable(this.player);
            this.player.body.debug = jam.settings.debug;
            this.player.health = 100;
            this.enemies = this.game.add.group(this.game.world, 'enemies', false, true, Phaser.Physics.ARCADE // body type
            );
            $('button').click(function (ev) {
                if (_this.button.timeout <= 0) {
                    _this.button.pressed = true;
                    _this.button.timeout = jam.settings.button.timeout;
                    console.log('got a button press!');
                    $(ev.target).prop('disabled', true);
                }
                else {
                    console.log('pressing button does nothing while timing out');
                }
            });
        };
        State.prototype.update = function () {
            var _this = this;
            --this.enemyCounter;
            this.button.timeout = Math.max(this.button.timeout - 1, 0);
            if (this.button.timeout <= 0) {
                $('button').prop('disabled', false);
            }
            if (this.enemyCounter <= 0) {
                this.addEnemy();
                this.enemyCounter = jam.settings.enemies.timeout;
            }
            if (this.button.timeout === 0) {
                if (this.cursors.left.isDown) {
                    this.player.body.velocity.x = -jam.settings.player.moveSpeed;
                }
                else if (this.cursors.right.isDown) {
                    this.player.body.velocity.x = jam.settings.player.moveSpeed;
                }
                else {
                    this.player.body.velocity.x = 0;
                }
                if (this.cursors.up.isDown) {
                    this.player.body.velocity.y = -jam.settings.player.moveSpeed;
                }
                else if (this.cursors.down.isDown) {
                    this.player.body.velocity.y = jam.settings.player.moveSpeed;
                }
                else {
                    this.player.body.velocity.y = 0;
                }
            }
            this.enemies.forEach(function (e) {
                var velx = 0, vely = 0;
                if (e.x > _this.player.x) {
                    velx = -jam.settings.enemies.xSpeed;
                }
                else if (e.x < _this.player.x) {
                    velx = jam.settings.enemies.xSpeed;
                }
                else {
                    velx = 0;
                }
                if (e.y > _this.player.y) {
                    vely = -jam.settings.enemies.ySpeed;
                }
                else if (e.y < _this.player.y) {
                    vely = jam.settings.enemies.ySpeed;
                }
                else {
                    vely = 0;
                }
                e.body.velocity.x = velx;
                e.body.velocity.y = vely;
                if (jam.dist(_this.player, e) < jam.settings.enemies.killRadius) {
                    --_this.player.health;
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
                this.button.timeout = jam.settings.button.timeout;
            }
        };
        State.prototype.buttonKill = function () {
            var _this = this;
            this.enemies.forEach(function (e) {
                var d = jam.dist(_this.player, e);
                console.log('enemy distance', d);
                if (d < jam.settings.button.deathRadius) {
                    console.log('killing! dist', d);
                    e.kill();
                }
                else {
                    console.log('not killing: dist', d);
                }
            }, this);
        };
        State.prototype.addEnemy = function () {
            if (this.enemies.length >= jam.settings.enemies.max) {
                console.log('not adding enemy (hit max)');
                return;
            }
            this.enemyCounter = jam.settings.enemies.timeout;
            var sprite = this.game.add.sprite(jam.randInt(0, jam.settings.viewport.width), jam.randInt(0, jam.settings.viewport.height), 'enemy');
            this.enemies.add(sprite);
            sprite.animations.add('normal', [0], 15, false);
            sprite.animations.play('normal');
            console.log('added enemy');
        };
        State.prototype.render = function () {
        };
        return State;
    })(Phaser.State);
    jam.State = State;
})(jam || (jam = {})); // module jam
// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    jam.state = new jam.State();
    jam.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', jam.state);
})(jam || (jam = {})); // module jam
