import { getGameWidth, getGameHeight } from '../functions/helpers';
import { AavegotchiObject } from '../types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public speed = 200;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Phaser.Physics.Arcade.Sprite;
  private selectedGotchi: AavegotchiObject;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  public create(): void {
    // Add a player sprite that can be moved around. Place him in the middle of the screen.
    this.player = this.physics.add.sprite(
      getGameWidth(this) / 2,
      getGameHeight(this) / 2,
      this.selectedGotchi.spritesheetKey,
    );

    this.player.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(this.selectedGotchi.spritesheetKey, { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });

    // This is a nice helper Phaser provides to create listeners for some of the most common keys.
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  public update(): void {
    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);

    switch (true) {
      case this.cursorKeys.left.isDown:
        velocity.x -= 1;
        this.player.anims.play('idle', false);
        break;
      case this.cursorKeys.right.isDown:
        velocity.x += 1;
        this.player.anims.play('idle', false);
        break;
      case this.cursorKeys.down.isDown:
        velocity.y += 1;
        this.player.anims.play('idle', false);
        break;
      case this.cursorKeys.up.isDown:
        velocity.y -= 1;
        this.player.anims.play('idle', false);
        break;
      default:
        this.player.anims.play('idle', true);
    }

    // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
    const normalizedVelocity = velocity.normalize();
    this.player.setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);
  }
}
