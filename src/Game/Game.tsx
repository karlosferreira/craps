import React, { useEffect } from 'react';
import Phaser from 'phaser';

function Game() {
    useEffect(() => {
        const createDice = (x: number, y: number, scene: Phaser.Scene, duration = 1000) => {
            let diceIsRolling = false;
            let diceRotationX = 0;
            let diceRotationY = 0;

            const dice = scene.add.mesh(x, y, "dice-albedo");
            const shadowFX = dice.postFX.addShadow(-3, 3, 0.006, 2, 0x111111, 10, .8);

            dice.addVerticesFromObj("dice-obj", 0.055);
            dice.panZ(6);

            dice.modelRotation.x = Phaser.Math.DegToRad(360);
            dice.modelRotation.y = Phaser.Math.DegToRad(720);

            return (callback: (value: number) => void) => {
                if (!diceIsRolling) {
                    diceIsRolling = true;
                    const diceRoll = Phaser.Math.Between(1, 4);

                    scene.add.tween({
                        targets: shadowFX,
                        x: 14,
                        y: -14,
                        duration: duration - 250,
                        ease: "Sine.Bounce.InOut",
                        yoyo: true,
                    });

                    scene.add.tween({
                        targets: dice,
                        from: 0,
                        to: 1,
                        duration: duration,
                        onUpdate: () => {
                            dice.modelRotation.x -= .07;
                            dice.modelRotation.y -= .07;
                            diceRotationX = dice.modelRotation.x;
                            diceRotationY = dice.modelRotation.y;
                        },
                        onComplete: () => {
                            switch (diceRoll) {
                                case 1:
                                    scene.add.tween({
                                        targets: dice.modelRotation,
                                        x: Phaser.Math.DegToRad(0),
                                        y: Phaser.Math.DegToRad(-90),
                                        duration: 500,
                                        ease: "Sine.easeInOut"
                                    });
                                    break;
                                case 2:
                                    scene.add.tween({
                                        targets: dice.modelRotation,
                                        x: Phaser.Math.DegToRad(90),
                                        y: Phaser.Math.DegToRad(0),
                                        duration: 500,
                                        ease: "Sine.easeInOut"
                                    });
                                    break;
                                case 3:
                                    scene.add.tween({
                                        targets: dice.modelRotation,
                                        x: Phaser.Math.DegToRad(180),
                                        y: Phaser.Math.DegToRad(0),
                                        duration: 500,
                                        ease: "Sine.easeInOut"
                                    });
                                    break;
                                case 4:
                                    scene.add.tween({
                                        targets: dice.modelRotation,
                                        x: Phaser.Math.DegToRad(180),
                                        y: Phaser.Math.DegToRad(180),
                                        duration: 500,
                                        ease: "Sine.easeInOut"
                                    });
                                    break;
                                case 5:
                                    scene.add.tween({
                                        targets: dice.modelRotation,
                                        x: Phaser.Math.DegToRad(-90),
                                        y: Phaser.Math.DegToRad(0),
                                        duration: 500,
                                        ease: "Sine.easeInOut"
                                    });
                                    break;
                                case 6:
                                    scene.add.tween({
                                        targets: dice.modelRotation,
                                        x: Phaser.Math.DegToRad(0),
                                        y: Phaser.Math.DegToRad(90),
                                        duration: 500,
                                        ease: "Sine.easeInOut"
                                    });
                                    break;
                            }
                            if (callback !== undefined) {
                                setTimeout(() => {
                                    callback(diceRoll);
                                    diceIsRolling = false;
                                }, 500);
                            }
                        },
                        ease: "Sine.easeInOut",
                    });

                    scene.add.tween({
                        targets: [dice],
                        scale: 1.4,
                        duration: duration - 14,
                        yoyo: true,
                        ease: Phaser.Math.Easing.Quadratic.InOut,
                        onComplete: () => {
                            dice.scale = 0.7;
                        }
                    });
                } else {
                    console.log("Is rolling");
                }
            }
        }

        const throwDie = (die: Phaser.GameObjects.Mesh, collisionArea: Phaser.GameObjects.Rectangle, scene: Phaser.Scene) => {
            let throwVelocityX = Phaser.Math.Between(-200, 200); // Velocidade X aleatória
            let throwVelocityY = Phaser.Math.Between(-500, -400); // Velocidade Y aleatória
            const duration = Phaser.Math.Between(1000, 2000); // Duração do lançamento

            let elapsed = 0;

            const updateFunction = () => {
                elapsed += scene.game.loop.delta; // Incrementar o tempo elapsed com o tempo entre cada frame
                const progress = elapsed / duration;

                // Calcular a nova posição do dado com base na velocidade e no tempo
                const newX = die.x + throwVelocityX * progress;
                const newY = die.y + throwVelocityY * progress;

                // Definir a nova posição do dado
                die.setPosition(newX, newY);

                // Obter os limites do dado manualmente
                const bounds = new Phaser.Geom.Rectangle(die.x - die.width / 2, die.y - die.height / 2, die.width, die.height);

                // Verificar colisão com a área de colisão
                if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, collisionArea.getBounds())) {
                    // Ricochetear invertendo a velocidade
                    throwVelocityX *= -1;
                    throwVelocityY *= -1;
                }

                // Verificar se a duração do lançamento foi atingida
                if (elapsed >= duration) {
                    // Parar de verificar a colisão e atualizar a posição do dado
                    scene.events.off("update", updateFunction, scene);
                    die.setPosition(newX, newY);
                }
            };

            scene.events.on("update", updateFunction, scene);
        };

        // Função para arremessar os dados
        const throwDice = (dice1: Function, dice2: Function, collisionArea: Phaser.GameObjects.Rectangle) => {
            // Arremessar o primeiro dado
            dice1((diceValue: number) => {
                console.log('Dice 1 value ', diceValue);
            });

            // Arremessar o segundo dado após um pequeno atraso
            setTimeout(() => {
                dice2((diceValue: number) => {
                    console.log('Dice 2 value ', diceValue);
                });
            }, 500);
        };

        // Variável para o botão de rolar
        let rollButton: Phaser.GameObjects.Rectangle;

        class GameScene extends Phaser.Scene {
            constructor() {
                super({ key: 'GameScene' });
            }

            preload(this: Phaser.Scene) {
                this.load.image('table-bg', 'assets/img/table-bg.gif');
                this.load.image("dice-albedo", "assets/obj/dice/dice-albedo.png");
                this.load.obj("dice-obj", "assets/obj/dice/dice.obj");
            }

            create(this: Phaser.Scene) {

                // Adicionar a imagem GIF como plano de fundo da tela e ajustar largura e altura
                const backgroundImage = this.add.image(100, 0, 'table-bg').setOrigin(0).setDisplaySize(window.innerWidth * 0.55, window.innerHeight * 0.6);

                // Calcular a posição vertical para centralizar a imagem
                const verticalPosition = (window.innerHeight - (backgroundImage.height * 1.5)) / 2;

                // Definir a posição da imagem mantendo a posição horizontal e ajustando apenas a vertical
                backgroundImage.setPosition(backgroundImage.x, verticalPosition);


                window.addEventListener('resize', () => resizeGame.call(this));

                document.body.style.overflowY = 'hidden';
                document.body.style.overflowX = 'hidden';

                this.scale.on('resize', () => resizeGame.call(this));
                resizeGame.call(this);

                const dice1 = createDice(this.scale.width / 3, this.scale.height / 2, this, 1000);
                const dice2 = createDice((this.scale.width / 3) * 2, this.scale.height / 2, this, 1000);

                // Criar a área de colisão com as mesmas dimensões que o plano de fundo
                const collisionArea = this.add.rectangle(0, 0, backgroundImage.width, backgroundImage.height, 0x000000, 0);
                collisionArea.setOrigin(0);
                collisionArea.setInteractive();

                const optionsPanel = this.add.container(this.scale.width / 2, this.scale.height - 100);

                const belowSevenOption = this.add.text(-100, 0, 'Abaixo de 7', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' })
                    .setInteractive()
                    .on('pointerdown', () => {
                        belowSevenOption.setStyle({ color: '#FF0000' });
                        equalSevenOption.setStyle({ color: '#FFFFFF' });
                        aboveSevenOption.setStyle({ color: '#FFFFFF' });
                    });

                const equalSevenOption = this.add.text(0, 0, 'Igual a 7', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' })
                    .setInteractive()
                    .on('pointerdown', () => {
                        belowSevenOption.setStyle({ color: '#FFFFFF' });
                        equalSevenOption.setStyle({ color: '#FF0000' });
                        aboveSevenOption.setStyle({ color: '#FFFFFF' });
                    });

                const aboveSevenOption = this.add.text(100, 0, 'Acima de 7', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' })
                    .setInteractive()
                    .on('pointerdown', () => {
                        belowSevenOption.setStyle({ color: '#FFFFFF' });
                        equalSevenOption.setStyle({ color: '#FFFFFF' });
                        aboveSevenOption.setStyle({ color: '#FF0000' });
                    });

                optionsPanel.add([belowSevenOption, equalSevenOption, aboveSevenOption]);

                const textDiceValue1 = this.add.text(this.scale.width / 3, this.scale.height / 2, '0', { fontFamily: 'Arial Black', fontSize: 74, color: '#c51b7d' });
                textDiceValue1.setStroke('#de77ae', 16).setScale(0);

                const textDiceValue2 = this.add.text((this.scale.width / 3) * 2, this.scale.height / 2, '0', { fontFamily: 'Arial Black', fontSize: 74, color: '#c51b7d' });
                textDiceValue2.setStroke('#de77ae', 16).setScale(0);

                rollButton = this.add.rectangle(0, this.scale.height - 50, this.scale.width, 50, 0x000000, 1)
                    .setAlpha(.9)
                    .setOrigin(0)
                    .setInteractive();

                this.add.text(rollButton.getCenter().x, rollButton.getCenter().y, 'Click to roll dice', {
                    font: '20px Courier',
                    color: '#00ff00',
                }).setOrigin(0.5);

                // Atualização do evento pointerdown do rollButton
                rollButton.on('pointerdown', () => {
                    throwDice(
                        (callback: Function) => {
                            dice1((diceValue: number) => {
                                console.log('Dice 1 value ', diceValue);
                                textDiceValue1.text = diceValue.toString();
                                textDiceValue1.setOrigin(0.5);
                                textDiceValue1.setPosition(this.scale.width / 3, this.scale.height / 2);

                                this.add.tween({
                                    targets: textDiceValue1,
                                    scale: 1,
                                    duration: 1000,
                                    ease: Phaser.Math.Easing.Bounce.Out,
                                    onComplete: () => {
                                        this.add.tween({
                                            targets: [textDiceValue1],
                                            scale: 0,
                                            delay: 1000,
                                            duration: 1000,
                                            ease: Phaser.Math.Easing.Bounce.Out,
                                        });
                                    }
                                });

                                // Chame a função de retorno de chamada com o valor do dado
                                callback(diceValue);
                            });
                        },
                        (callback: Function) => {
                            dice2((diceValue: number) => {
                                console.log('Dice 2 value ', diceValue);
                                textDiceValue2.text = diceValue.toString();
                                textDiceValue2.setOrigin(0.5);
                                textDiceValue2.setPosition((this.scale.width / 3) * 2, this.scale.height / 2);

                                this.add.tween({
                                    targets: textDiceValue2,
                                    scale: 1,
                                    duration: 1000,
                                    ease: Phaser.Math.Easing.Bounce.Out,
                                    onComplete: () => {
                                        this.add.tween({
                                            targets: [textDiceValue2],
                                            scale: 0,
                                            delay: 1000,
                                            duration: 1000,
                                            ease: Phaser.Math.Easing.Bounce.Out,
                                        });
                                    }
                                });

                                // Chame a função de retorno de chamada com o valor do dado
                                callback(diceValue);
                            });
                        },
                        collisionArea
                    );
                });


                const rect = this.add.rectangle(0, this.scale.height - 50, this.scale.width, 50, 0x000000, 1)
                    .setAlpha(.9)
                    .setOrigin(0);
                this.add.text(rect.getCenter().x, rect.getCenter().y, 'Click to roll dice', {
                    font: '20px Courier',
                    color: '#00ff00',
                }).setOrigin(0.5);
            }

            // Função para redimensionar o jogo
            resizeGame(this: Phaser.Scene) {
                // Atualizar a escala do plano de fundo para preencher a tela
                const backgroundImage = this.children.getByName('table-bg') as Phaser.GameObjects.Image;
                if (backgroundImage) {
                    backgroundImage.setScale(window.innerWidth / backgroundImage.width, window.innerHeight / backgroundImage.height);
                    backgroundImage.setPosition(this.scale.width / 2, this.scale.height / 2);
                }
            }
        }

        // Função para redimensionar o jogo e ajustar o conteúdo
        function resizeGame(this: Phaser.Scene) {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Atualizar as dimensões da tela do jogo
            this.cameras.resize(width, height);

            // Centralizar o conteúdo do jogo na tela
            this.cameras.main.centerOn(width / 2, height / 2);
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
            }
        };

        const game = new Phaser.Game(config);

        const showInitialMessage = () => {
            const messageDiv = document.createElement('div');
            messageDiv.id = 'initial-message';
            messageDiv.style.position = 'fixed';
            messageDiv.style.top = '0';
            messageDiv.style.left = '0';
            messageDiv.style.width = '100%';
            messageDiv.style.height = '100%';
            messageDiv.style.zIndex = '9999999999';
            messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            messageDiv.style.color = '#ffffff';
            messageDiv.style.display = 'flex';
            messageDiv.style.alignItems = 'center';
            messageDiv.style.justifyContent = 'center';
            messageDiv.innerHTML = 'Clique na tela para iniciar o jogo';

            messageDiv.addEventListener('click', startGame);

            document.body.appendChild(messageDiv);
        };

        const startGame = () => {
            const initialMessage = document.getElementById('initial-message');
            if (initialMessage) {
                initialMessage.remove();
            }
        };

        window.addEventListener('load', () => {
            const element = document.documentElement;

            const isFullscreen = document.fullscreenElement;

            if (!isFullscreen) {
                showInitialMessage();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = document.fullscreenElement;
            const initialMessage = document.getElementById('initial-message');
            if (isFullscreen && initialMessage) {
                initialMessage.remove();
            } else if (!isFullscreen && !initialMessage) {
                showInitialMessage();
            }
        });

        document.body.addEventListener('click', () => {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
        });

    }, []);

    return <div id="game-scene" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#2c3e50', // Cor de fundo do jogo
    }}>
    </div>;
}

export default Game;