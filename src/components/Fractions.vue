<template>
<div class="panel dark">
    <h1>Brøk</h1>
    <div class="container panel light">
        <template v-for="(fraction, index) in fractions" :key="index">
            <single-fraction 
                v-bind:starting-numerator="fraction.startingNumerator" 
                v-bind:starting-denominator="fraction.startingDenominator" 
                v-bind:id="index"
                @modifierChanged="modifierChanged"
            />
            <div v-if="index < fractions.length-1">
                +
            </div>
        </template>
        =<br>
    </div>
    <br>
    <div class="container panel light">
        <template v-for="(fraction, index) in fractions" :key="index">
            <single-fraction 
                :starting-numerator="fraction.modifiedNumerator" 
                :starting-denominator="fraction.modifiedDenominator" 
                :id="index"
                :show-controls="false"
            />
            <div v-if="index < fractions.length-1">
                +
            </div>
        </template>
        =<br>
    </div>
    <br>
    <template v-if="allFractionsHaveCommonDenominator()">
        <div class="container panel light">
            <single-fraction 
                :string-numerator="getConcatenatedStringNumerator()" 
                :starting-numerator="0" 
                :starting-denominator="fractions[0].modifiedDenominator" 
                :show-controls="false"
            />
            =<br>
            <single-fraction 
                :starting-numerator="summedFraction.startingNumerator" 
                :starting-denominator="summedFraction.startingDenominator" 
                :show-controls="true"
                @modifierChanged="summedFractionModifierChanged"
            />
            <div v-if="false">
                =
                <single-fraction 
                    :starting-numerator="summedFraction.modifiedNumerator" 
                    :starting-denominator="summedFraction.modifiedDenominator"
                    :show-controls="false"
                /> <!-- This is buggy. Shows 'false' until it's updated. Disabled for now. -->
            </div>
        </div>

    </template>
    <h2 v-else>
        Utvid og forkort brøkene ovenfor slik at de får felles nevner.
    </h2>
</div>
</template>

<script>
import SingleFraction from '@/components/fractions/SingleFraction.vue'
export default {
    components: {
        SingleFraction
    },
    data() {
        return {
            fractions: [
                this.getFractionObject(4, 12),
                this.getFractionObject(3, 6),
                this.getFractionObject(8, 2),
                // this.getFractionObject(Math.floor(Math.random() * 24) + 1, Math.floor(Math.random() * 24) + 1),
                // this.getFractionObject(Math.floor(Math.random() * 24) + 1, Math.floor(Math.random() * 24) + 1),
                // this.getFractionObject(Math.floor(Math.random() * 24) + 1, Math.floor(Math.random() * 24) + 1),
                // this.getFractionObject(10, 12),
            ],
            showSummary: false,
            summedFraction: null
        }
    },
    created() {
        this.summedFraction = this.getFractionObject(this.getSummedStringNumerator(), this.getCommonDenominator())
    },
    computed: {

    },
    methods: {
        modifierChanged(event) {
            this.fractions[event.id].modifier = event.modifier
            this.fractions[event.id].modifiedNumerator = event.modifiedNumerator
            this.fractions[event.id].modifiedDenominator = event.modifiedDenominator
            this.summedFraction.startingNumerator = this.getSummedStringNumerator()
            this.summedFraction.startingDenominator = this.getCommonDenominator()
        },
        summedFractionModifierChanged(event) {
            this.summedFraction.modifiedNumerator = event.modifiedNumerator
            this.summedFraction.modifiedDenominator = event.modifiedDenominator
            console.log(event)
        },
        allFractionsHaveCommonDenominator() {
            for(var i=1; i<this.fractions.length; i++){
                if(this.fractions[i].modifiedDenominator !== this.fractions[0].modifiedDenominator) {
                    return false;
                }
            }
            return true;
        },
        getCommonDenominator() {
            return (this.allFractionsHaveCommonDenominator() ? this.fractions[0].modifiedDenominator : false)
        },
        getConcatenatedStringNumerator() {
            var s = "";
            for (var i=0; i<this.fractions.length; i++) {
                s = s + ' '+ this.fractions[i].modifiedNumerator
                if (i < this.fractions.length-1) {
                    s = s + ' + '
                }
            }
            return s
        },
        getSummedStringNumerator() {
            var s = 0;
            for (var i=0; i<this.fractions.length; i++) {
                console.log(s, this.fractions[i].modifiedNumerator)
                s += this.fractions[i].modifiedNumerator
            }
            return s
        },
        getFractionObject(startingNumerator, startingDenominator) {
            return {
                stringNumerator: "",
                startingNumerator,
                startingDenominator,
                modifiedNumerator: startingNumerator,
                modifiedDenominator: startingDenominator,
                modifier: 0
            }
        }
    },
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
	align-content: center;
}
.container div {
    padding: 5px;
}

</style>