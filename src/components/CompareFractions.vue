<template>
    <div class="panel dark backgroundPanel" :style="{backgroundImage: `url(${publicPath}student.svg)`, backgroundRepeat: 'no-repeat', backgroundPosition: '8% 2%'}">
        <div class="panel light marginBottom">
            <h1 style="margin: 0;">Brøk</h1>
        </div>
        <div class="faded panel light marginBottom left">
            <ul>
                <li>Velg om brøken på venstre side er større, lik eller mindre enn brøken på høyre side.</li>
                <li>Bruk redigeringsknappen for å utvide og forkorte brøkene.</li>
                <li>Trykk 'Sjekk svar' når du er ferdig.</li>
                <li>Oppdater siden for nye brøker.</li>
            </ul>
        </div>
        <div v-for="(problem, index) in problems" :key="index" class="panel light container marginBottom">
            <button :class="{ active: problems[index].editActivated }" @click="toggleEditFraction(index)"><i class="fas fa-pencil-alt"></i></button>
            <single-fraction 
                v-bind:starting-numerator="problem.fraction1.startingNumerator" 
                v-bind:starting-denominator="problem.fraction1.startingDenominator" 
                v-bind:id="index"
                :show-controls="problems[index].editActivated === true"
            />
            
            <div style="margin: 0 20px;">
                <button :class="{ active: problems[index].givenAnswer === GREATER_THAN }" @click="answerClicked(index, GREATER_THAN)"><i class="fas fa-greater-than"></i></button>
                <button :class="{ active: problems[index].givenAnswer === EQUAL_TO }"     @click="answerClicked(index, EQUAL_TO)"><i class="fas fa-equals"></i></button>
                <button :class="{ active: problems[index].givenAnswer === LESS_THAN }"    @click="answerClicked(index, LESS_THAN)"><i class="fas fa-less-than"></i></button>
            </div>

            <single-fraction 
                v-bind:starting-numerator="problem.fraction2.startingNumerator" 
                v-bind:starting-denominator="problem.fraction2.startingDenominator" 
                v-bind:id="index"
                :show-controls="problems[index].editActivated === true"
            />
            <div v-if="checkAnswersActive">
                <div v-if="isCorrectlyAnswered(index)">Riktig!</div>
                <div v-else>Feil...</div>
            </div>
        </div>
        <div v-if="false">
            {{ numCorrect }} korrekte på {{ numTries }} forsøk.
        </div>
        <button class="active" @click="checkAnswersClicked()">Sjekk svar</button>
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
            publicPath: process.env.BASE_URL,
            problems: [],
            GREATER_THAN: 0, EQUAL_TO: 1, LESS_THAN: 2,
            checkAnswersActive: false,
            numCorrect: 0,
            numTries: 0,
        }
    },
    created() {
        this.generateProblems()
    },
    computed: {

    },
    methods: {
        generateProblems() {
            for (var i=0; i<5; i++) {
                const fraction1 = this.getFractionObject(this.getRandom(1, 10), this.getSensibleDenominator())
                const fraction2 = this.getFractionObject(this.getRandom(1, 10), this.getSensibleDenominator())
                const correctAnswer = this.calculateAnswerConst(fraction1, fraction2)
                this.problems.push({
                    fraction1,
                    fraction2,
                    correctAnswer,
                    givenAnswer: null,
                })
            }
        },
        calculateAnswerConst(fraction1, fraction2) {
            const decimalFraction1 = fraction1.startingNumerator / fraction1.startingDenominator
            const decimalFraction2 = fraction2.startingNumerator / fraction2.startingDenominator
            var answer
            if (decimalFraction1 == decimalFraction2) { answer = this.EQUAL_TO }
            if (decimalFraction1 > decimalFraction2)  { answer = this.GREATER_THAN }
            if (decimalFraction1 < decimalFraction2)  { answer = this.LESS_THAN }
            return answer
        },
        getRandom(min, max) {
            const i = Math.floor(Math.random() * max) + min
            return i
        },
        getSensibleDenominator() {
            const a = this.getRandom(1, 5)
            const b = this.getRandom(1, 5)
            const d = a * b
            return d
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
        },
        isCorrectlyAnswered(index) {
            return this.problems[index].givenAnswer === this.problems[index].correctAnswer
        },
        answerClicked(index, answer) {
            this.problems[index].givenAnswer = (this.problems[index].givenAnswer == answer ? null : answer)
            this.checkAnswersClicked(false)
        },
        checkAnswersClicked(enableCheck = null) {
            if (enableCheck === null) {
                // if (this.checkAnswersActive === false) {
                //     for (var i=0; i<this.problems.length; i++) {
                //         if (this.isCorrectlyAnswered()) {
                //             this.numCorrect++
                //         }
                //     }
                //     this.numTries++
                // }
                this.checkAnswersActive = !this.checkAnswersActive
            } else {
                this.checkAnswersActive = enableCheck
            }
            return this.checkAnswersActive
        },
        toggleEditFraction(index) {
            // Close all other open edits
            for (var i=0; i<this.problems.length; i++) {
                if (i !== index) {
                    this.problems[i].editActivated = false
                }
            }
            this.problems[index].editActivated = !this.problems[index].editActivated
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
    border-radius: 20px;
}
.container div {
    padding: 5px;
}


</style>