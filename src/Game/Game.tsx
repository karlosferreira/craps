import React, { useEffect } from 'react';
import Phaser from 'phaser';

function Game() {
    useEffect(() => {
        class GameScene extends Phaser.Scene {
            constructor() {
                super({ key: 'GameScene' });
            }

            preload() {
                this.load.image('dice-albedo', 'assets/obj/dice/dice-albedo.png');
                this.load.obj('dice-obj', 'assets/obj/dice/dice.obj');
            }

            create() {
                // Adiciona um plano como chão
                const ground = this.add.rectangle(0, 400, 800, 100, 0x006600) as Phaser.GameObjects.Rectangle;
                this.physics.add.existing(ground, true);

// Adiciona os dados
const dice1 = this.add.mesh(0, 0, 'dice-albedo', 'dice-obj', [0]);
const dice2 = this.add.mesh(0, 0, 'dice-albedo', 'dice-obj', [0]);



                // Posiciona os dados
                dice1.setPosition(200, 200);
                dice2.setPosition(600, 200);

                // Habilita a detecção de colisão com o chão
                this.physics.add.collider(dice1, ground);
                this.physics.add.collider(dice2, ground);

                // Configura a física dos dados
                if (dice1.body && dice2.body && dice1.body instanceof Phaser.Physics.Arcade.Body && dice2.body instanceof Phaser.Physics.Arcade.Body) {
                    dice1.body.setCollideWorldBounds(true);
                    dice1.body.setBounce(0.5, 0.5);
                    dice1.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-500, -400));

                    dice2.body.setCollideWorldBounds(true);
                    dice2.body.setBounce(0.5, 0.5);
                    dice2.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-500, -400));
                }

            }
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            scene: [GameScene],
            backgroundColor: '#2c3e50',
            parent: 'game-scene',
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 1000, y: 1000 }, // Adiciona gravidade para os dados caírem
                    debug: true // Ativa o modo de depuração para visualizar as colisões
                }
            }
        };

        const game = new Phaser.Game(config);

        // Função para determinar a face do dado voltada para a câmera
        function detectFrontFace(dice: Phaser.GameObjects.Mesh): number {
            // Implementação da lógica de detecção de face...
            return Phaser.Math.Between(1, 6);
        }

    }, []);

    return <div id="game-scene"></div>;
}

export default Game;
