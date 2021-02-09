import Node from './Node.js';

export default class BinarySearchTree {
    constructor() {
        this.root = null;
        this.direction = "asc"; //switch this to "desc" when inverting
    }

    flipDirection(){
        if (this.direction === "asc") {
            this.direction = "desc";
        } else {
            this.direction = "asc";
        }
    }

    insert(data) {
        var newNode = new Node(data);
        if (this.root === null){
            this.root = newNode;
            return this.root.x;
        }
        else {
            return this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            newNode.x = newNode.x - 2;
            newNode.y = newNode.y + 2;
            if (node.left === null){
                let same = this.getNodeWithSamePosition(this.root, newNode.x, newNode.y)
                if(same !==  null){
                    same.label = Math.min(newNode.data, same.data) + "|" + Math.max(newNode.data, same.data);
                    newNode.label = same.label;
                }
                node.left = newNode;
            }
            else {
                this.insertNode(node.left, newNode);
            }
        }
        else {
            newNode.x = newNode.x + 2;
            newNode.y = newNode.y + 2;
            if (node.right === null) {
                let same = this.getNodeWithSamePosition(this.root, newNode.x, newNode.y)
                if (same !== null) {
                    same.label = Math.min(newNode.data, same.data) + "|" + Math.max(newNode.data, same.data);
                    newNode.label = same.label;
                }
                node.right = newNode;
            }
            else {
                this.insertNode(node.right, newNode);
            }
        }
        return {x: newNode.x, y: newNode.y};
    }

    getNodeWithSamePosition(node, X, Y){
        if(node !== null){
            if (node.x === X && node.y === Y) {
                return node;
            }
            let leftResult = this.getNodeWithSamePosition(node.left, X, Y);
            let rightResult = this.getNodeWithSamePosition(node.right, X, Y);
            if(leftResult) return leftResult;
            if(rightResult) return rightResult;
        }
        return null;
    }

    remove(data) {
        this.root = this.removeNode(this.root, data);
    }

    removeNode(node, key) {
        if (node === null)
            return null;
        else if (key < node.data) {
            node.left = this.removeNode(node.left, key);
            return node;
        }
        else if (key > node.data) {
            node.right = this.removeNode(node.right, key);
            return node;
        }
        else {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            if (node.left === null) {
                node = node.right;
                return node;
            }
            else if (node.right === null) {
                node = node.left;
                return node;
            }

            var aux = this.findMinNode(node.right);
            node.data = aux.data;

            node.right = this.removeNode(node.right, aux.data);
            return node;
        }
    }

    invert(node) {
        if(node !== null){
            let temp = node.left;
            node.left = node.right;
            node.right = temp;
            if (node.left !== null) node.left.x = node.left.x * (-1);
            if (node.right !== null) node.right.x = node.right.x * (-1);
            if (node.label !== null) node.label = node.label.split('|')[1] + '|' + node.label.split('|')[0];
            this.invert(node.left);
            this.invert(node.right);
        }
    }

    findMinNode(node) {
        if (node.left === null)
            return node;
        else
            return this.findMinNode(node.left);
    }

    fillMatrix(node, matrix, minX, side = "root") {
        if(node !== null){
            matrix[node.y][node.x + Math.abs(minX)] = node.label ? node.label : node.data;
            if(side === "left"){
                matrix[node.y-1][node.x + Math.abs(minX)+1] = '/';
            }
            else if (side === "right"){
                matrix[node.y - 1][node.x + Math.abs(minX) - 1] = '\\';
            }
            this.fillMatrix(node.left, matrix, minX, "left");
            this.fillMatrix(node.right, matrix, minX, "right");
        }
        return matrix;
    }

    getRootNode() {
        return this.root;
    }

    search(node, data) {
        if (node === null)
            return null;
        else if (data < node.data)
            return this.search(node.left, data);
        else if (data > node.data)
            return this.search(node.right, data);
        else
            return node;
    }

    inorder(node) {
        if (node !== null) {
            this.inorder(node.left);
            console.log(node.data);
            this.inorder(node.right);
        }
    }

    postorder(node) {
        if (node !== null) {
            this.postorder(node.left);
            this.postorder(node.right);
            console.log(node.data);
        }
    }

    preorder(node) {
        if (node !== null) {
            console.log(node.data);
            this.preorder(node.left);
            this.preorder(node.right);
        }
    }
}