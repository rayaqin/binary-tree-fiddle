import React, { PureComponent } from 'react';
import BinarySearchTree from '../../classes/BinarySearchTree.js';
import './MainPage.css'

class MainPage extends PureComponent{

    state = {
        currentInputValue: "",
        tree: new BinarySearchTree(),
        displayGrid: [],
        leftmostX: 0,
        rightmostX: 0,
        yDepth: 0,
        insertDisabled: true,
        listTooltipVisible: false,
        insertTooltipVisible: false,
        invertTooltipVisible: false,
        clearTooltipVisible: false
    }

    handleChange = (event) => {
        if(!isNaN(event.target.value) && event.target.value.split('')[0] !== '0'){
            this.setState({
                insertDisabled: event.target.value.length === 0,
                currentInputValue: event.target.value.trim()
            })
        }
    }

    handleSubmit = () => {
        let currentCoordinates = this.state.tree.insert(parseInt(this.state.currentInputValue));
        let newLeftMost = this.state.leftmostX;
        let newRightMost = this.state.rightmostX;
        let newYDepth = this.state.yDepth;

        if(currentCoordinates.x < this.state.leftmostX){
            newLeftMost = currentCoordinates.x
        } else if (currentCoordinates.x > this.state.rightmostX){
            newRightMost = currentCoordinates.x
        }
        if (currentCoordinates.y > this.state.yDepth) {
            newYDepth = currentCoordinates.y
        }

        let emptyMatrix = this.createMatrix(newLeftMost, newRightMost, newYDepth);
        let filledMatrix = this.state.tree.fillMatrix(this.state.tree.getRootNode(), emptyMatrix, newLeftMost);

        this.setState({
            insertTooltipVisible: false,
            insertDisabled: true,
            currentInputValue: "",
            leftmostX: newLeftMost,
            rightmostX: newRightMost,
            yDepth: newYDepth,
            displayGrid: filledMatrix
        })

    }

    handleKeyPress = (event) => {
        if(event.key === "Enter" && this.state.currentInputValue ){
            this.handleSubmit();
        }
    }

    createMatrix = (minX, maxX, depth) => {
        let displayMatrix = [];
        for (let i = 0; i <= depth; i++) {
            let line = [];
            for (let j = 0; j <= maxX - minX; j++) {
                line.push(' ');
            }
            displayMatrix.push(line);
        }
        return displayMatrix;
    }

    invertTree = () => {
        this.state.tree.invert(this.state.tree.getRootNode());

        let newLeftMost = this.state.rightmostX * (-1);
        let newRightMost = this.state.leftmostX * (-1);

        let emptyMatrix = this.createMatrix(newLeftMost, newRightMost, this.state.yDepth);
        let filledMatrix = this.state.tree.fillMatrix(this.state.tree.getRootNode(), emptyMatrix, newLeftMost);

        this.setState({
            displayGrid: filledMatrix,
            rightmostX: newRightMost,
            leftmostX: newLeftMost
        })
    }

    clearTree = () => {
        this.setState({
            currentInputValue: "",
            tree: new BinarySearchTree(),
            displayGrid: [],
            leftmostX: 0,
            rightmostX: 0,
            yDepth: 0,
            insertDisabled: true
        })
    }

    listToConsole = () => {
        console.log(this.state.tree.inorder(this.state.tree.getRootNode()));
    }

    listHover = () => {
        this.setState({
            listTooltipVisible: true
        })
    }

    listHoverDone = () => {
        this.setState({
            listTooltipVisible: false
        })
    }

    insertHover = () => {
        this.setState({
            insertTooltipVisible: true
        })
    }

    insertHoverDone = () => {
        this.setState({
            insertTooltipVisible: false
        })
    }

    clearHover = () => {
        this.setState({
            clearTooltipVisible: true
        })
    }

    clearHoverDone = () => {
        this.setState({
            clearTooltipVisible: false
        })
    }

    invertHover = () => {
        this.setState({
            invertTooltipVisible: true
        })
    }

    invertHoverDone = () => {
        this.setState({
            invertTooltipVisible: false
        })
    }

    renderTableData() {
        let keyBase = 0;
        return this.state.displayGrid.map((line) => {
            return (
                <tr key={++keyBase} className="gridRow">
                    {
                        line.map((field) => {
                            let fieldClass = "gridCell" + (isNaN(parseInt(field)) ? "" : " visibleCell");
                            return (
                                <td key={++keyBase}>
                                    <div className={fieldClass}>
                                        {field}
                                    </div>
                                </td>
                            )
                        })
                    }
                </tr>
            )
         })
    }

    render(){
        return(
            <div className="mainPageOuterShell">
                <div className="addForm">
                    <input
                        type="text"
                        className="inputBox"
                        value={this.state.currentInputValue}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}/>
                    <button
                        onMouseOver={this.insertHover}
                        onMouseLeave={this.insertHoverDone}
                        disabled={this.state.insertDisabled}
                        className="controlButton"
                        onClick={this.handleSubmit}>
                        Insert
                        {this.state.insertTooltipVisible &&
                            <div className="tooltip insertTooltip">
                                Adds a node to the tree.
                        </div>}
                    </button>
                </div>

                <div className="controlPanel">
                    <button
                        onMouseOver={this.invertHover}
                        onMouseLeave={this.invertHoverDone}
                        className="controlButton"
                        onClick={this.invertTree}
                        disabled={this.state.displayGrid.length === 0}>
                        Invert
                        {this.state.invertTooltipVisible &&
                            <div className="tooltip invertTooltip">
                                Inverts the entire tree from left to right.
                        </div>}
                    </button>
                    <button
                        onMouseOver={this.clearHover}
                        onMouseLeave={this.clearHoverDone}
                        className="controlButton"
                        onClick={this.clearTree}
                        disabled={this.state.displayGrid.length === 0}>
                        Clear
                        {this.state.clearTooltipVisible &&
                            <div className="tooltip clearTooltip">
                                Deletes all nodes from the tree.
                        </div>}
                    </button>
                    <button
                        onMouseOver={this.listHover}
                        onMouseLeave={this.listHoverDone}
                        className="controlButton"
                        onClick={this.listToConsole}
                        disabled={this.state.displayGrid.length === 0}>
                        List
                        {this.state.listTooltipVisible &&
                            <div className="tooltip listTooltip">
                                Lists the tree node values to the console.
                            </div> }
                    </button>
                </div>

                <div className="gridContainer">
                    <table id='treeGrid'>
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default MainPage;