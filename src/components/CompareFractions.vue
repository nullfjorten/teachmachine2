<template>
    <div class="panel dark">
        <h1>Brøk</h1>
        <div v-for="(problem, index) in problems" :key="index" class="panel light container">
            <single-fraction 
                v-bind:starting-numerator="problem.fraction1.startingNumerator" 
                v-bind:starting-denominator="problem.fraction1.startingDenominator" 
                v-bind:id="index"
                :show-controls="false"
            />
            
            <div style="margin: 0 20px;">
                <button :class="{ active: problems[index].answer === GREATER_THAN }" @click="answerClicked(index, GREATER_THAN)"><i class="fas fa-greater-than"></i></button>
                <button :class="{ active: problems[index].answer === EQUAL_TO }"     @click="answerClicked(index, EQUAL_TO)"><i class="fas fa-equals"></i></button>
                <button :class="{ active: problems[index].answer === LESS_THAN }"    @click="answerClicked(index, LESS_THAN)"><i class="fas fa-less-than"></i></button>
            </div>

            <single-fraction 
                v-bind:starting-numerator="problem.fraction2.startingNumerator" 
                v-bind:starting-denominator="problem.fraction2.startingDenominator" 
                v-bind:id="index"
                :show-controls="false"
            />
        </div>
        <button class="active">Sjekk svar</button>
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
            problems: [
                {
                    fraction1: this.getFractionObject(4, 12),
                    fraction2: this.getFractionObject(2, 12),
                    answer: null,
                },                {
                    fraction1: this.getFractionObject(4, 12),
                    fraction2: this.getFractionObject(2, 12),
                    answer: null,
                },
            ],
            GREATER_THAN: 0, EQUAL_TO: 1, LESS_THAN: 2,
        }
    },
    created() {
    },
    computed: {

    },
    methods: {
        getFractionObject(startingNumerator, startingDenominator) {
            return {
                stringNumerator: "",
                startingNumerator,
                startingDenominator,
                modifiedNumerator: startingNumerator,
                modifiedDenominator: startingDenominator,
                modifier: 0
            }
        },
        answerClicked(index, answer) {
            this.problems[index].answer = (this.problems[index].answer == answer ? null : answer)
            // console.log('Answer ID clicked', index)
        },
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
    border-radius: 5px;
}
.container div {
    padding: 5px;
}
/* .fas {
    padding: 10px !important;
    margin: 10px !important;
    background-color: rgba(194, 194, 194, 0.698);
    border-radius: 10px;
}
.selected {
    background-color: 
} */

</style>