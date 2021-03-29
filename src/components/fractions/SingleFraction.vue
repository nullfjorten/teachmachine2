<template>
    <div class="fraction">
        <div v-if="showControls" class="fas fa-arrow-up" @click="increaseFraction()"></div>
        <div>
            <template v-if="stringNumerator.length > 0">
                <span>{{stringNumerator}}</span>
            </template>
            <template v-else>
                <span v-if="modifier == 0">{{startingNumerator}}</span>
                <span v-else>
                    <span class="faded">{{startingNumerator}}{{divideOrMultiplySign}}{{positivizedMod}}=</span>{{modifiedNumerator}}
                </span>
            </template>
            <hr>
            <span v-if="modifier == 0">{{startingDenominator}}</span>
            <span v-else>
                <span class="faded">{{startingDenominator}}{{divideOrMultiplySign}}{{positivizedMod}}=</span>{{modifiedDenominator}}
            </span>
        </div>
        <div v-if="showControls" class="fas fa-arrow-down" :class="{ faded: !isReducible }" @click="decreaseFraction()"></div>
    </div>
</template>

<script>
export default {
    props: {
        stringNumerator: {
            type: String,
            required: false,
            default: ""
        },
        startingNumerator: {
            type: Number,
            required: true
        },
        startingDenominator: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: false
        },
        showControls: { type: Boolean, default: true },
    },
    data() {
        return {
            modifier: 0,
        }
    },
    computed: {
        modifiedNumerator: function() {
            return this.calculateModdedNumber(this.startingNumerator, this.modifier)
        },
        modifiedDenominator: function() {
            return this.calculateModdedNumber(this.startingDenominator, this.modifier)
        },
        positivizedMod() {
            if (this.modifier < 0) {
                return this.modifier * -1
            }
            return this.modifier
        },
        divideOrMultiplySign() {
            if (this.modifier > 0) {
                return '*'
            } else if (this.modifier < 0) {
                return ':'
            } else {
                return false
            }
        },
        isReducible() {
            const nextDecreasedModifier = this.getNextDecreasedModifier(this.modifier)
            if (nextDecreasedModifier === false) {
                return false
            }
            return true
        },
    },
    watch:
    {
        modifier(newValue, oldValue)
        {
            if (newValue !== oldValue) {
                this.$emit('modifierChanged', {
                    modifier: newValue,
                    modifiedNumerator: this.modifiedNumerator,
                    modifiedDenominator: this.modifiedDenominator,
                    id: this.id,
                })
            }
        }
    },
    methods: {
        calculateModdedNumber: function(inputNumber, modifier) {
            if (modifier == 0) {
                return inputNumber
            } else if (modifier > 0)  {
                return inputNumber * modifier
            } else {
                return inputNumber / this.positivizedMod
            }
            
        },
        increaseFraction() {
            if (this.modifier == 0) { // Skip 1
                this.modifier = 2
                // console.log('increaseFraction going from 0 to', this.modifier)
                return
            }
            if (this.modifier == -2) { // Skip -1
                this.modifier = 0
                // console.log('increaseFraction going from -2 to', this.modifier)
                return
            }
            if (this.modifier < 0) {
                this.modifier++
                var numTries = 0
                while (!this.isDivisible(this.modifier)) {
                    this.modifier++
                    numTries++
                    if (numTries > 1000) {
                        console.error('Caught runaway loop in increaseFraction', numTries)
                        break
                    }
                }
                return
            }
            this.modifier++
        },
        decreaseFraction() {
            const nextDecreasedModifier = this.getNextDecreasedModifier(this.modifier)
            if (nextDecreasedModifier !== false) {
                this.modifier = nextDecreasedModifier
            }
        },
        getNextDecreasedModifier(modifier) {
            if (isNaN(modifier)) {
                console.error('getNextDecreasedModifier got NaN as modifier', modifier)
                return false
            }

            if (modifier == 2) { // Skip 1
                return 0
            }
            if (modifier > 0) {
                modifier--;
                return modifier
            }

            if (modifier == 0) { // Skip -1
                modifier = -2 
            } else {
                modifier--
            }

            var numTries = 0
            while (!this.isDivisible(modifier)) {
                if (modifier*-1 > this.startingNumerator || modifier*-1 > this.startingDenominator) {
                    return false
                }
                numTries++
                if (numTries > 1000) {
                    console.error('Caught runaway loop in getNextDecreasedModifier', numTries)
                    break
                }
                modifier--
            }
            return modifier
        },
        isDivisible(modifier) {
            if (modifier == 0) { return false }
            modifier = (modifier < 0 ? modifier*-1 : modifier)
            return (this.startingDenominator % modifier === 0) && (this.startingNumerator % modifier === 0)
        },
    }
}
</script>

<style scoped>
.fraction {
    min-width: 50px;
}
.faded {
    opacity: 0.5;
}
hr {
    border: 1px solid;
}
</style>