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
        <div v-if="showControls" class="fas fa-arrow-down" @click="decreaseFraction()"></div>
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
        }
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
                return
            }
            if (this.modifier == -2) { // Skip -1
                this.modifier = 0
                return
            }
            if (this.modifier < 0) {
                this.modifier++
                while (!this.isDivisible()) {
                    this.modifier++
                }
                return
            }
            this.modifier++
        },
        decreaseFraction() {
            const originalModifier = this.modifier
            if (this.modifier == 2) { // Skip 1
                this.modifier = 0
                return
            }
            if (this.modifier > 0) {
                this.modifier--;
                return
            }

            if (this.modifier == 0) { // Skip -1
                this.modifier = -2 
            } else {
                this.modifier--
            }
            while (!this.isDivisible()) {
                if (this.positivizedMod > this.startingNumerator || this.positivizedMod > this.startingDenominator) {
                    this.modifier = originalModifier
                    break
                }
                this.modifier--
            }
        },
        isDivisible() {
            var positiveMod = null
            if (this.modifier == 0) { return false }
            if (this.modifier > 0 ) { positiveMod = this.modifier }
            if (this.modifier < 0 ) { positiveMod = this.positivizedMod }
            return (this.startingDenominator % positiveMod === 0) && (this.startingNumerator % positiveMod === 0)
        }
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
</style>