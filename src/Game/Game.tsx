import React, { useEffect } from 'react';
import Phaser from 'phaser';

function Game() {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            scene: {
                preload,
                create,
                update
            }
        };

        const game = new Phaser.Game(config);

        function preload(this: Phaser.Scene) {
            // Pré-carregamento de recursos do jogo
        }

        function create(this: Phaser.Scene) {
            // Criar elementos do jogo
            const text = this.add.text(100, 100, 'Phaser Game', { fontSize: '32px', color: '#fff' });
        }

        function update(this: Phaser.Scene) {
            // Lógica de atualização do jogo
        }

        // Limpar o jogo quando o componente for desmontado
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container"></div>;
}

export default Game;
