<template>
    <h1>Brøk</h1>
    <div class="container">
        <template v-for="(fraction, index) in fractions" :key="index">
            <single-fraction v-bind:starting-numerator="fraction.startingNumerator" v-bind:starting-denominator="fraction.startingDenominator" />
            <div v-if="index < fractions.length-1">
                +
            </div>
            <div v-else>
                =
            </div>
        </template>

        <!-- <single-fraction v-bind:starting-numerator="fractions[0].startingNumerator" v-bind:starting-denominator="fractions[0].startingDenominator" />
        <div>+</div>
        <single-fraction v-bind:starting-numerator="fractions[1].startingNumerator" v-bind:starting-denominator="fractions[1].startingDenominator" />
        <div>+</div>
        <single-fraction v-bind:starting-numerator="fractions[2].startingNumerator" v-bind:starting-denominator="fractions[2].startingDenominator" />
        <div>=</div> -->
        <input type="text">
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
                {
                    startingNumerator: 2,
                    startingDenominator: 4,
                },
                {
                    startingNumerator: 5,
                    startingDenominator: 3,
                },
                {
                    startingNumerator: 180,
                    startingDenominator: 180,
                },
            ]
        }
    }
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
hr {
    border: 1px solid;
}
starting[type=text] {
    width: 40px;
    margin-left: 5px;
}
</style>