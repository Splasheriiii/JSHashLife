const NW = 0;
const NE = 1;
const SW = 2;
const SE = 3;

class QuadTree {    
    level = -1;
    hasValue = false;
    hashCode = "";
    constructor(level, nodes) {
        this.level = level;
        if(level == 0) {            
            this.hasValue = (nodes === true);
            this.hashCode = nodes === true ? "1" : "0";
        } else {
            this.hashCode = "";
            for (let index = NW; index <= SE; index++) {
                this[index] = nodes[index];
                this.hasValue |= this[index].hasValue;
                this.hashCode += this[index].hashCode;
            }
        }
    }
    toString() {
        return this.hashCode;
    }
    NextGeneration(TreesCollection) {
        if (this.level < 3 || this.#CheckValues()) {
            return this.#Resize(TreesCollection).NextGeneration(TreesCollection)
        } else {
            return this.#GetResult(TreesCollection);
        }
    }
    #GetResult(TreesCollection) {
        if (!this.hasValue) {
            return TreesCollection.CreateTree(this.level - 1, undefined);
        } else {        
            if (this.level == 2) {
                return this.#ApplyLifeRulesForCenter(TreesCollection);
            } else {
                let topCenter = QuadTree.MergeTwoTrees(TreesCollection, true, this[NW], this[NE]).#GetResult(TreesCollection);
                let centerLeft = QuadTree.MergeTwoTrees(TreesCollection, false, this[NW], this[SW]).#GetResult(TreesCollection);
                let centerCenter = TreesCollection.CreateTree(this.level - 1, [this[NW][SE],this[NE][SW],this[SW][NE],this[SE][NW]]).#GetResult(TreesCollection);
                let centerRight = QuadTree.MergeTwoTrees(TreesCollection, false, this[NE], this[SE]).#GetResult(TreesCollection);
                let botCenter = QuadTree.MergeTwoTrees(TreesCollection, true, this[SW], this[SE]).#GetResult(TreesCollection);
                return TreesCollection.CreateTree(this.level - 1,[
                    TreesCollection.CreateTree(this.level - 2, [
                       this[NW].#GetResult(TreesCollection)[SE],
                       topCenter[SW],
                       centerLeft[NE],
                       centerCenter[NW]
                    ]),
                    TreesCollection.CreateTree(this.level - 2, [
                        topCenter[SE],
                        this[NE].#GetResult(TreesCollection)[SW],
                        centerCenter[NE],
                        centerRight[NW]
                    ]),
                    TreesCollection.CreateTree(this.level - 2, [
                        centerLeft[SE],
                        centerCenter[SW],
                        this[SW].#GetResult(TreesCollection)[NE],
                        botCenter[NW]
                    ]),
                    TreesCollection.CreateTree(this.level - 2, [
                        centerCenter[SE],
                        centerRight[SW],
                        botCenter[NE],
                        this[SE].#GetResult(TreesCollection)[NW]
                    ]),
                ]);             
            }
        }
    }
    /**
     * Iterates throw all nodes, checking if value has only the nearest to center sub-node.
     * @returns true if any subTree has value except this[i][SE - i][j]
     */
    #CheckValues(){
        let res = false;
        for (let i = NW; i <= SE; i++) {
            for (let j = NW; j <= SE; j++) {           
                res |= (this[i][j].hasValue || this[i][SE - i][j].hasValue) && j != SE - i;
            }
        }
        return res;
    }
    #Resize(TreesCollection) {
        return TreesCollection.CreateTree(
            this.level + 1,
            [
                TreesCollection.CreateTree(this.level, [
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    this[NW],
                ]),
                TreesCollection.CreateTree(this.level, [
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    this[NE],
                    TreesCollection.CreateTree(this.level - 1,undefined),
                ]),
                TreesCollection.CreateTree(this.level, [
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    this[SW],
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    TreesCollection.CreateTree(this.level - 1,undefined),
                ]),
                TreesCollection.CreateTree(this.level, [
                    this[SE],
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    TreesCollection.CreateTree(this.level - 1,undefined),
                    TreesCollection.CreateTree(this.level - 1,undefined),
                ]),
            ]
        );                             
    }
    #ApplyLifeRulesForCenter(TreesCollection) {
        return TreesCollection.CreateTree(
            this.level - 1,[
            TreesCollection.CreateTree(this.level - 2,    
                QuadTree.ApplyLifeRules([
                this[NW][NW], this[NW][NE], this[NE][NW],
                this[NW][SW], this[NE][SW],
                this[SW][NW], this[SW][NE], this[SE][NW],
                ], this[NW][SE].hasValue)
            ),
            TreesCollection.CreateTree(this.level - 2,    
                QuadTree.ApplyLifeRules([
                this[NW][NE], this[NE][NW], this[NE][NE],
                this[NW][SE], this[NE][SE],
                this[SW][NE], this[SE][NW], this[SE][NE],
                ], this[NE][SW].hasValue)
            ),
            TreesCollection.CreateTree(this.level - 2,    
                QuadTree.ApplyLifeRules([
                this[NW][SW], this[NW][SE], this[NE][SW],
                this[SW][NW], this[SE][NW],
                this[SW][SW], this[SW][SE], this[SE][SW],
                ], this[SW][NE].hasValue)
            ),
            TreesCollection.CreateTree(this.level - 2,    
                QuadTree.ApplyLifeRules([
                this[NW][SE], this[NE][SW], this[NE][SE],
                this[SW][NE], this[SE][NE],
                this[SW][SE], this[SE][SW], this[SE][SE],
                ], this[SE][NW].hasValue)
            ),
        ]);
    }
    static MergeTwoTrees(TreesCollection, isHorizontal, first, second) {
        return TreesCollection.CreateTree(
            first.level,
            isHorizontal ?
            [
                first[NE], 
                second[NW], 
                first[SE], 
                second[SW]
            ]
            :
            [
                first[SW],
                first[SE],
                second[NW],
                second[NE],
            ])
    }
    static ApplyLifeRules(neighbours, currentState) {
        let aliveCount = 0;
        neighbours.forEach(tree => {
            aliveCount += tree.hasValue ? 1 : 0;
        });
        return aliveCount == 3 || (aliveCount == 2 && currentState)
    }
}

class TreesCollection {    
    constructor() {
        this["0"] = new QuadTree(0, false);
        this["1"] = new QuadTree(0, true);
    }
    CreateTree(level, nodes) {
        if (nodes === undefined) {
            if (level == 1) {
                return this.CreateTree(
                    level, [
                    this.CreateTree(0, false),
                    this.CreateTree(0, false),
                    this.CreateTree(0, false),
                    this.CreateTree(0, false)
                ]);
            } else {
                return this.CreateTree(level, [
                    this.CreateTree(level - 1, undefined),
                    this.CreateTree(level - 1, undefined),
                    this.CreateTree(level - 1, undefined),
                    this.CreateTree(level - 1, undefined),
                ])
            }
        } else if (nodes === true) {
            return this["1"];
        } else if (nodes === false) {
            return this["0"];
        } else {
            let hashCode = "";
            for (let index = NW; index <= SE; index++) {
                hashCode += nodes[index].hashCode;
            }            
            let quadTree = this[hashCode];
            if (quadTree === undefined) {
                quadTree = new QuadTree(level, nodes);
                this[hashCode] = quadTree;
            }
            return quadTree;
        }
    }
}