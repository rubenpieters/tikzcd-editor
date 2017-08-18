import {h, render, Component} from 'preact'
import copy from 'copy-text-to-clipboard'
import * as diagram from '../diagram'

import Grid from './grid'
import Toolbox from './toolbox'

export default class App extends Component {
    constructor() {
        super()

        this.state = {
            tool: 'pan',
            diagram: {
                nodes: [
                    {id: '0', position: [1, 1], value: 'T'},
                    {id: '1', position: [2, 1], value: 'X'},
                    {id: '2', position: [2, 2], value: 'Z'},
                    {id: '3', position: [1, 2], value: 'Y'},
                    {id: '4', position: [0, 0], value: 'X\\times_Z Y'}
                ],
                edges: [
                    {from: '1', to: '2', tail: 'hookalt', head: 'none'},
                    {from: '3', to: '2', tail: 'mapsto', head: 'harpoonalt'},
                    {from: '0', to: '1', value: 'f', tail: 'tail', head: 'twoheads'},
                    {from: '0', to: '3', value: 'g\\circ h', alt: true, dashed: true},
                    {from: '4', to: '0', value: '\\phi', tail: 'hook', head: 'harpoon'},
                    {from: '4', to: '1', value: 'p_X', tail: 'hook', bend: 30},
                    {from: '4', to: '3', value: 'p_Y', alt: true, tail: 'tail', bend: -30}
                ]
            }
        }
    }

    componentDidMount() {
        // Switch tool when holding Control

        document.addEventListener('keydown', evt => {
            if (evt.keyCode === 17) {
                // Control

                if (this.prevTool != null) return

                this.prevTool = this.state.tool
                this.setState({tool: this.prevTool === 'pan' ? 'arrow' : 'pan'})
            }
        })

        document.addEventListener('keyup', evt => {
            if (evt.keyCode === 17) {
                // Control

                if (this.prevTool == null) return

                this.setState({tool: this.prevTool})
                this.prevTool = null
            }
        })
    }

    handleToolClick = evt => {
        if (evt.id === 'code') {
            copy(diagram.toTeX(this.state.diagram))

            return
        } else if (evt.id === 'about') {
            let a = render((
                <a href="https://github.com/yishn/tikzcd-editor" target="_blank" />
            ), document.body)

            a.click()
            a.remove()

            return
        }

        this.setState({tool: evt.id})
    }

    handleDataChange = evt => {
        this.setState({diagram: evt.data})
    }

    render() {
        return <div id="root">
            <Grid
                cellSize={130}
                data={this.state.diagram}
                mode={this.state.tool}

                onDataChange={this.handleDataChange}
            />

            <Toolbox
                tool={this.state.tool}
                onItemClick={this.handleToolClick}
            />
        </div>
    }
}
