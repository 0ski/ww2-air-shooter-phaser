
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

  create: function () {
    
    this.sea = this.add.tileSprite(0, 0, 1024, 768, 'sea');
    
    this.setupText();
    this.setupPlayerIcons();
    this.setupPlayer();
    this.setupEnemies();
    this.setupBullets();
    this.setupExplosions();

    this.cursors = this.input.keyboard.createCursorKeys();
  },
  
  setupText: function () {
    this.instructions = this.add.text(510, 600, 'Spacebar - kill enemies, arrows - move,\nHolding click/tap does both,\nNow go in there and fight you maggot!', {font: '20px consolas', fill: '#fff', align: 'center'});
    this.instructions.anchor.setTo(0.5, 0.5);
    this.instExpire = this.time.now + 10000;
    
    this.score = 5900;
    this.scored = 0;
    this.scoreText = this.add.text(510, 30, this.score.toString(), {font: '20px consolas', fill: '#fff', align: 'center'});
    this.scoreText.anchor.setTo(0.5, 0.5);
  },
  
  setupPlayerIcons: function () {
    this.lives = this.add.group();
    for (var i=0; i<3; i++) {
      var life = this.lives.create(924 + (30 * i), 30, 'player');
      life.scale.setTo(0.5, 0.5);
      life.anchor.setTo(0.5, 0.5);
    }
    
    this.powers = this.add.group();
    this.powers.enableBody = true;
    this.powers.physicsBodyType = Phaser.Physics.ARCADE;
    this.powers.createMultiple(5, 'powerup1');
    this.powers.setAll('anchor.x', 0.5);
    this.powers.setAll('anchor.y', 0.5);
    this.powers.setAll('outOfBoundsKill', 0.5);
    this.powers.setAll('checkWorldBounds', 0.5);
    this.powers.setAll('reward', 100, false, false, 0, true);
  },
  
  setupPlayer: function () {
    this.player = this.add.sprite(400, 650, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fly', [0,1,2], 20, true);
    this.player.animations.add('faded', [3,0,3,1], 20, true);
    this.player.play('fly');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.speed = 300;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(20, 20, 0, -5);
    this.player.fireRate = 10;
    this.player.fireThrottle = this.player.fireRate;
    this.player.weapon = 0;
  },
  
  setupEnemies: function () {
    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemies.createMultiple(50, 'greenEnemy');
    this.enemies.setAll('anchor.x', 0.5);
    this.enemies.setAll('anchor.y', 0.5);
    this.enemies.setAll('outOfBoundsKill', true);
    this.enemies.setAll('checkWorldBounds', true);
    this.enemies.setAll('reward', 100, false, false, 0, true);
    this.enemies.setAll('dropRate', 0.3, false, false, 0, true);
    
    this.enemies.nextAt = 0;
    this.enemies.delay = 1000;
    this.enemies.health = 2;
    
    this.enemies.forEach(function (enemy) {
      enemy.animations.add('fly', [0,1,2], 20, true);
      enemy.animations.add('hit', [3,1,3,2], 20, false);
      enemy.events.onAnimationComplete.add(function(enemy) {
        enemy.play('fly');
      }, this);
    });

    this.shooters = this.add.group();
    this.shooters.enableBody = true;
    this.shooters.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooters.createMultiple(50, 'whiteEnemy');
    this.shooters.setAll('anchor.x', 0.5);
    this.shooters.setAll('anchor.y', 0.5);
    this.shooters.setAll('outOfBoundsKill', true);
    this.shooters.setAll('checkWorldBounds', true);
    this.shooters.setAll('reward', 200, false, false, 0, true);
    this.shooters.setAll('fireThrottle', 0, false, false, 0, true);
    this.shooters.setAll('dropRate', 0.5, false, false, 0, true);
    
    this.shooters.nextAt = 0;
    this.shooters.delay = 2000;
    this.shooters.health = 5;
    this.shooters.fireRate = 1000;
    
    this.shooters.forEach(function (shooter) {
      shooter.animations.add('fly', [0,1,2], 20, true);
      shooter.animations.add('hit', [3,1,3,2], 20, false);
      shooter.events.onAnimationComplete.add(function(shooter) {
        shooter.play('fly');
      }, this);
    });
    
    this.bosses = this.add.group();
    this.bosses.enableBody = true;
    this.bosses.physicsBodyType = Phaser.Physics.ARCADE;
    this.bosses.createMultiple(10, 'boss');
    this.bosses.setAll('anchor.x', 0.5);
    this.bosses.setAll('anchor.y', 0.5);
    this.bosses.setAll('outOfBoundsKill', true);
    this.bosses.setAll('checkWorldBounds', true);
    this.bosses.setAll('reward', 10000, false, false, 0, true);
    this.bosses.setAll('fireThrottle', 0, false, false, 0, true);
    this.bosses.setAll('dropRate', 0, false, false, 0, true);
    
    this.bosses.forEach(function (boss) {
      boss.animations.add('fly', [0,1,2], 20, true);
      boss.animations.add('hit', [3,1,3,2], 20, false);
      boss.events.onAnimationComplete.add(function (boss) {
        boss.play('fly');
      }, this);
    });
    
    this.bossApproaching = false;
    this.bosses.health = 10;
  },
  
  setupBullets: function () {
    this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(100, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(100, 'enemyBullet');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 0.5);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);
    this.enemyBullets.setAll('reward', 0, false, false, 0, true);
  },
  
  setupExplosions: function () {
    this.explosions = this.add.group();
    this.explosions.enableBody = true;
    this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosions.createMultiple(100, 'explosion');
    this.explosions.setAll('anchor.x', 0.5);
    this.explosions.setAll('anchor.y', 0.5);
    this.explosions.forEach(function (explosion) {
      explosion.animations.add('boom');
    });
  },

  update: function () {
    this.sea.tilePosition.y += 0.2;
    
    this.checkCollisions();
    this.spawnEnemies();
    this.enemyFire();
    this.processPlayerInput();
    this.processDelayedEffects();
  },
  
  checkCollisions: function () {
    this.physics.arcade.overlap(this.bullets, this.enemies, this.enemyHit, null, this);
    this.physics.arcade.overlap(this.bullets, this.shooters, this.enemyHit, null, this);
    this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
    this.physics.arcade.overlap(this.player, this.shooters, this.playerHit, null, this);
    this.physics.arcade.overlap(this.player, this.enemyBullets, this.playerHit, null, this);
    this.physics.arcade.overlap(this.player, this.powers, this.powerUp, null, this);
    this.physics.arcade.overlap(this.player, this.bosses, this.playerHit, null, this);
    this.physics.arcade.overlap(this.bullets, this.bosses, this.enemyHit, null, this);
  },
  
  spawnEnemies: function () {
    if (this.enemies.nextAt < this.time.now && this.enemies.countDead() > 0) {
      var enemy = this.enemies.getFirstExists(false);
      enemy.reset(this.rnd.integerInRange(20,1004), 0, this.enemies.health);
      enemy.body.velocity.y = this.rnd.integerInRange(30,60);
      enemy.play('fly');
      this.enemies.nextAt = this.time.now + this.enemies.delay;
    }
    if (this.shooters.nextAt < this.time.now && this.shooters.countDead() > 0) {
      var shooter = this.shooters.getFirstExists(false);
      var destination = this.rnd.integerInRange(20,1004);
      
      shooter.reset(this.rnd.integerInRange(20,1004), 0, this.shooters.health);
      shooter.rotation = this.physics.arcade.moveToXY(shooter, destination, 768, this.rnd.integerInRange(30, 80)) - Math.PI / 2;
      shooter.play('fly');
      this.shooters.nextAt = this.time.now + this.shooters.delay;
    }
  },
  
  enemyFire: function () {
    this.shooters.forEachAlive(function (shooter) {
      if (this.time.now > shooter.fireThrottle && this.enemyBullets.countDead() > 0) {
        var bullet = this.enemyBullets.getFirstExists(false);
        bullet.reset(shooter.x, shooter.y);
        this.physics.arcade.moveToObject(bullet, this.player, 150);
        shooter.fireThrottle = this.time.now + this.shooters.fireRate;
      }
    }, this);
  },
  
  processPlayerInput: function () {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.player.speed;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    }
    
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    }
    
    if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }
    
    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown) {
      if (this.returnText && this.returnText.exists) {
        this.quitGame();
      } else {
        this.fire();
      }
    }
    
    this.player.fireThrottle = this.player.fireThrottle === this.player.fireRate ? this.player.fireThrottle : this.player.fireThrottle + 1;
  },
  
  processDelayedEffects: function () {
    if (this.instructions.exists &&  this.time.now > this.instExpire) {
      this.instructions.destroy();
    }
    
    if (this.player.faded && this.player.faded < this.time.now) {
      this.player.faded = null;
      this.player.play('fly');
    }
    
    if (this.showReturn && this.time.now > this.showReturn) {
      this.returnText = this.add.text(512, 400, 'Press SPACEBAR or TAP or CLICK to go back to Main Menu', {font: '16px consolas', fill: '#fff', align: 'center'});
      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }
    
    if (this.bossApproaching && this.bossApproaching.y > 80 && !this.bossApproaching.initailized) {
      this.bossApproaching.initailized = true;
      this.bossApproaching.health = this.bosses.health;
      this.bossApproaching.body.velocity.x = 200;
      this.bossApproaching.body.velocity.y = 0;
      this.bossApproaching.body.bounce.x = 1;
      this.bossApproaching.body.collideWorldBounds = true;
    }
  },

  fire: function () {
    var bullet;

    if (this.player.fireThrottle == this.player.fireRate && this.player.alive) {
      if (this.bullets.countDead() < this.player.weapon * 2) {
        return;
      }
      if (this.player.weapon === 0) {
        bullet = this.bullets.getFirstExists(false);
        bullet.reset(this.player.x, this.player.y - 20);
        bullet.body.velocity.y = -500;
      } else {
        for (var i=0; i<this.player.weapon; i++) {
          bullet = this.bullets.getFirstExists(false);
          bullet.reset(this.player.x - (10 + i * 6), this.player.y - 20);
          this.physics.arcade.velocityFromAngle(-95 - i * 10, 500, bullet.body.velocity);
          bullet = this.bullets.getFirstExists(false);
          bullet.reset(this.player.x + (10 + i * 6), this.player.y - 20);
          this.physics.arcade.velocityFromAngle(-85 + i * 10, 500, bullet.body.velocity);
        }
      }
      this.player.fireThrottle = 0;
    }
  },
  
  explode: function (sprite) {
    if (!this.explosions.countDead()) {
      return;
    }
    
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(sprite.x, sprite.y);
    explosion.play('boom', 15, false, true);
    explosion.body.velocity.x = sprite.body.velocity.x / Math.abs(sprite.body.velocity.x) * 20;
    explosion.body.velocity.y = sprite.body.velocity.y / Math.abs(sprite.body.velocity.y) * 20;
  },
  
  enemyHit: function (bullet, enemy) {
    bullet.kill();
    this.damageEnemy(enemy, 1);
  },
  
  damageEnemy: function (enemy, dmg) {
    enemy.damage(dmg);
    if (enemy.alive) {
      enemy.play('hit');
    } else {
      this.explode(enemy);
      this.dropPowerUp(enemy);
      this.increaseScore(enemy.reward);
      if (enemy.key === 'boss') {
        this.bossApproaching.initailized = false;
        this.bossApproaching = false;
        this.defeatedBosses++;
      }
    }
  },
  
  dropPowerUp: function (enemy) {
    if (this.powers.countDead() === 0 || this.player.weapon === 5) {
      return;
    }
    
    if (this.rnd.frac() < enemy.dropRate) {
      var powerUp = this.powers.getFirstExists(false);
      powerUp.reset(enemy.x, enemy.y);
      powerUp.body.velocity.y = 100;
    }
  },
  
  powerUp: function (player, power) {
    this.increaseScore(power.reward);
    power.kill();
    if (player.weapon < 5) {
      player.weapon++;
    }
  },
  
  increaseScore: function (reward) {
    this.score += reward;
    this.scoreText.text = this.score;
    
    if ((this.score - this.scored) / 5000 > 1 && !this.bossApproaching) {
      this.scored += 5000;
      this.spawnBoss();
    } 

    if (this.defeatedBosses === 5) {
      this.enemies.destroy();
      this.shooters.destroy();
      this.enemyBullets.destroy();
      this.displayEnd(true);
    }
  },
  
  spawnBoss: function () {
    var boss = this.bosses.getFirstExists(false);
    boss.initailized = false;
    boss.body.bounce.x = 0;
    boss.reset(512, 0, this.bosses.health);
    this.physics.enable(boss, Phaser.Physics.ARCADE);
    boss.body.velocity.y = 15;
    boss.body.velocity.x = 0;
    boss.play('fly');
    console.log(boss.body.x, boss.body.y);
    this.bossApproaching = boss;    
  },
  
  playerHit: function (player, enemy) {
    var life = this.lives.getFirstAlive();
    
    if (life) {
      life.kill();
      this.player.faded = this.time.now + 3000;
      this.player.play('faded');
      this.player.weapon = 0;
    } else {
      this.explode(player);
      player.kill();
      this.displayEnd(false);
    }
        
    this.damageEnemy(enemy, 5);
    enemy.kill();
  },
  
  render: function () {

  },
  
  displayEnd: function (win) {
    if (this.endText && this.endText.exists) {
      return;
    }
    
    var msg = win ? 'YOU WIN!' : 'GAME OVER!';
    this.endText = this.add.text(510, 320, msg, {font: '72px consolas', fill: '#fff', align: 'center'});
    this.endText.anchor.setTo(0.5, 0);
    this.showReturn = this.time.now + 2000;
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.sea.destroy();
    this.player.destroy();
    this.enemies.destroy();
    this.shooters.destroy();
    this.bullets.destroy();
    this.enemyBullets.destroy();
    this.explosions.destroy();
    this.instructions.destroy();
    this.scoreText.destroy();
    this.endText.destroy();
    this.returnText.destroy();
    
    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  },
  

};
