<template>
    <div class="fraction">
        <div class="fas fa-arrow-up" @click="increaseFraction()"></div>
        <div>
            <span v-if="modifier == 0">{{startingNumerator}}</span>
            <span v-else>
                <span class="faded">{{startingNumerator}}{{divideOrMultiplySign}}{{positivizedMod}}=</span>{{modifiedNumerator}}
            </span>
            <hr>
            <span v-if="modifier == 0">{{startingDenominator}}</span>
            <span v-else>
                <span class="faded">{{startingNumerator}}{{divideOrMultiplySign}}{{positivizedMod}}=</span>{{modifiedDenominator}}
            </span>
        </div>
        <div class="fas fa-arrow-down" @click="decreaseFraction()"></div>
    </div>
</template>

<script>
export default {
    props: {
        startingNumerator: {
            type: String,
            required: true
        },
        startingDenominator: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            modifier: 0
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
            const modWasZero = (this.modifier == 0 ? true : false)
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
                if (this.positivizedMod >= this.startingNumerator || this.positivizedMod >= this.startingDenominator) {
                    console.log('Caught!');
                    this.modifier = (modWasZero ? 0 : this.modifier+1)
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
            console.log('Mod: '+ positiveMod);
            return (this.startingDenominator % positiveMod === 0) && (this.startingNumerator % positiveMod === 0)
        }
    }
}
</script>

<style scoped>
.fraction {
    min-width: 25px;
}
.faded {
    opacity: 0.5;
}
</style>