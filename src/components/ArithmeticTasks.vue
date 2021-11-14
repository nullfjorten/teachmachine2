<template>
    <div class="dark panel backgroundPanel" :style="{margin: 0, backgroundImage: `url(${publicPath}student.svg)`, backgroundRepeat: 'no-repeat', backgroundPosition: '12% 12%'}">
        <transition name="problem" @after-leave="problemAnimationAfterLeave">
            <div v-if="showProblem" class="problem">
                {{ problem }} =
            </div>
        </transition>

        <transition name="answer" appear mode="out-in">
            <div v-if="this.selectAnswersActive" class="potentialAnswerContainer">
                <button v-for="potentialAnswer in this.potentialAnswers" :key="potentialAnswer" @click="setAnswer(potentialAnswer)" class="potentialAnswer">{{potentialAnswer}}</button>
            </div>
            <div v-else>
                <input class="answer" type="text" v-model="answer" ref="txtAnswer" @keypress.enter="enterPressed()" pattern="\d*" placeholder="Skriv svaret her">
            </div>
        </transition>

        <div class="dark panel" style="padding: 0">
            <div class="light panel">
                <p>Antall riktige: {{ numCorrectAnswers }}</p>
                <div>
                    <button class="operator" :class="[operator == '+' && !randomProblemTypesActivated ? 'active' : '']" @click="setActiveProblemType('+')" title="Pluss (addisjon)"><i class="fa fa-plus"></i></button>
                    <button class="operator" :class="[operator == '-' && !randomProblemTypesActivated ? 'active' : '']" @click="setActiveProblemType('-')" title="Minus (subtraksjon)"><i class="fa fa-minus"></i></button>
                    <button class="operator" :class="[operator == '*' && !randomProblemTypesActivated ? 'active' : '']" @click="setActiveProblemType('*')" title="Gange (multiplikasjon)"><i class="fa fa-times"></i></button>
                    <button class="operator" :class="[operator == '/' && !randomProblemTypesActivated ? 'active' : '']" @click="setActiveProblemType('/')" title="Dele (divisjon)"><i class="fa fa-divide"></i></button>
                    <button class="operator" :class="[randomProblemTypesActivated == true ? 'active' : '']" @click="activateRandomProblemTypes((!randomProblemTypesActivated))" title="Tilfeldige regnearter"><i class="fa fa-question"></i></button>
                </div>
                <div>
                    <button :class="[difficulty == '1' ? 'active' : '']" @click="setProblemDifficulty('1')">Lett</button>
                    <button :class="[difficulty == '2' ? 'active' : '']" @click="setProblemDifficulty('2')">Middels</button>
                    <button :class="[difficulty == '3' ? 'active' : '']" @click="setProblemDifficulty('3')">Vanskelig</button>
                </div>
                <div>
                    <button :class="[tensChallengeActive == '1' ? 'active' : '']" @click="toggleTensChallenge()" title="Tiervenner">10</button>
                    <button :class="[selectAnswersActive == '1' ? 'active' : '']" @click="toggleSelectAnswers()" title="Velg svar"><i class="fa fa-hand-pointer"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="dark panel" v-if="showDebug">
        numCorrectAnswers: {{ numCorrectAnswers }}<br>
        difficulty: {{ difficulty }}<br>
        Correct Answer: {{ correctAnswer }}<br>
        Answer: {{ answer }}<br>
    </div>
</template>

<script>
export default {
    created() {
    },
    mounted() {
        if (localStorage.getItem('numCorrectAnswers') !== null)           { this.numCorrectAnswers           = Number(localStorage.getItem('numCorrectAnswers')) }
        if (localStorage.getItem('activeProblemTypeIndex') !== null)      { this.activeProblemTypeIndex      = Number(localStorage.getItem('activeProblemTypeIndex')) }
        if (localStorage.getItem('difficulty') !== null)                  { this.difficulty                  = localStorage.getItem('difficulty') }
        if (localStorage.getItem('randomProblemTypesActivated') !== null) { this.randomProblemTypesActivated = (localStorage.getItem('randomProblemTypesActivated') === 'true') }
        if (localStorage.getItem('tensChallengeActive') !== null)         { this.tensChallengeActive         = (localStorage.getItem('tensChallengeActive') === 'true') }
        if (localStorage.getItem('selectAnswersActive') !== null)         { this.selectAnswersActive         = (localStorage.getItem('selectAnswersActive') === 'true') }
        this.generateProblem()
        this.generatePotentialAnswers()
    },
    data() {
        return {
            publicPath: process.env.BASE_URL,
            problemTypes: [
                { 'operator': '+', 'heading': '+ Addisjon (pluss)' },
                { 'operator': '-', 'heading': '- Subraksjon (minus)' },
                { 'operator': '*', 'heading': '* Multiplikasjon (gange)' },
                { 'operator': '/', 'heading': ': Divisjon (dele)' },
            ],
            activeProblemTypeIndex: 2, // 0-4
            randomProblemTypesActivated: false,
            randomProblemTypeHeading: '+ - * / Tilfeldige regnearter',
            difficulty: '1', // '1'-'3'
            points: 0,
            problem: '',
            correctAnswer: '',
            numCorrectAnswers: 0,
            answer: '',
            potentialAnswers: [],
            a: 0,
            b: 0,
            tensChallengeActive: false,
            selectAnswersActive: false,
            previousA: null,
            previousB: null,
            showDebug: false,
            showProblem: true,
        }
    },
    computed: {
        operator() {
            return this.problemTypes[this.activeProblemTypeIndex].operator;
        },
        heading() {
            if (this.randomProblemTypesActivated) {
                return this.randomProblemTypeHeading;
            }
            else {
                return this.problemTypes[this.activeProblemTypeIndex].heading;
            }
        },
        isCorrect() {
            //alert('Answer: '+ this.answer +'. Length: '+ this.answer.length)

            if (this.answer.length > 0 && this.answer == this.correctAnswer) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    watch: {
        answer() {
            if (this.answer == 'debug') { this.showDebug = !this.showDebug }
            if (this.isCorrect) {
                this.numCorrectAnswers++
                this.showProblem = false
                this.generateProblem()
                this.generatePotentialAnswers()
                return true;
            }
            else {
                return false;
            }
        },
        numCorrectAnswers()           { this.updateLocalStorage() },
        activeProblemTypeIndex()      { this.updateLocalStorage() },
        difficulty()                  { this.updateLocalStorage() },
        randomProblemTypesActivated() { this.updateLocalStorage() },
        tensChallengeActive()         { this.updateLocalStorage() },
        selectAnswersActive()         { this.updateLocalStorage() },
    },
    methods: {
        updateLocalStorage() {
            try {
                localStorage.setItem('numCorrectAnswers', this.numCorrectAnswers)
                localStorage.setItem('activeProblemTypeIndex', this.activeProblemTypeIndex)
                localStorage.setItem('difficulty', this.difficulty)
                localStorage.setItem('randomProblemTypesActivated', this.randomProblemTypesActivated)
                localStorage.setItem('tensChallengeActive', this.tensChallengeActive)
                localStorage.setItem('selectAnswersActive', this.selectAnswersActive)
            } catch (error) {
            console.error(error);
            }
        },
        problemAnimationAfterLeave() {
            this.generateProblem()
            this.generatePotentialAnswers()
            this.showProblem = true
        },
        checkForCommands() {
            if (this.answer === 'debug') {
                this.showDebug = !this.showDebug;
            }
        },
        activateRandomProblemTypes(active = true) {
            this.randomProblemTypesActivated = active;
            this.generateProblem();
            this.generatePotentialAnswers()
        },
        setActiveProblemType(problemTypeOperator) {
            this.activateRandomProblemTypes(false);
            for (var i = 0; i < this.problemTypes.length; i++) {
                if (problemTypeOperator == this.problemTypes[i].operator) {
                    if (i == this.activeProblemTypeIndex) {
                        return true; // No change
                    }
                    this.activeProblemTypeIndex = i;
                    this.generateProblem();
                    this.generatePotentialAnswers()
                    return true; // Changed
                }
            }
            console.error('Invalid problemTypeOperator', problemTypeOperator);
            return false;
        },
        setProblemDifficulty(difficulty) {
            this.difficulty = difficulty;
            this.generateProblem();
            this.generatePotentialAnswers()
        },
        toggleTensChallenge() {
            this.tensChallengeActive = !this.tensChallengeActive;
            this.generateProblem();
            this.generatePotentialAnswers()
        },
        toggleSelectAnswers() {
            this.selectAnswersActive = !this.selectAnswersActive;
        },
        setTensChallenge(active = true) {
            this.tensChallengeActive = active;
        },
        generateProblem() {
            // Store data from previous problem (setRandomIntAB uses this to avoid repeats of the same problem)
            this.previousA = this.a;
            this.previousB = this.b;

            if (this.randomProblemTypesActivated) {
                this.activeProblemTypeIndex = Math.floor(Math.random() * this.problemTypes.length);
            }
            var operator = this.operator;
            var tmp;

            switch (operator) {
                case '+': 
                    if (this.tensChallengeActive) {
                        switch (this.difficulty) {
                            case '1': this.setRandomIntAB([0, 10]); break;
                            case '2': this.setRandomIntAB([1, 100]); break;
                            case '3': this.setRandomIntAB([1, 1000]); break;
                            default:
                                console.error('Invalid addition difficulty', this.difficulty);
                        }
                    } else {
                        switch (this.difficulty) {
                            case '1': this.setRandomIntAB([0, 10]); break;
                            case '2': this.setRandomIntAB([19, 100]); break;
                            case '3': this.setRandomIntAB([19, 1000]); break;
                            default:
                                console.error('Invalid addition difficulty', this.difficulty);
                        }
                    }
                    break;
                case '-': 
                    if (this.tensChallengeActive) {
                        switch (this.difficulty) {
                            case '1': this.setRandomIntAB([0, 10]); break;
                            case '2': this.setRandomIntAB([1, 100]); break;
                            case '3': this.setRandomIntAB([1, 1000]); break;

                            default:
                                console.error('Invalid subtraction difficulty', this.difficulty);
                        }
                    } else {
                        switch (this.difficulty) {
                            case '1': this.setRandomIntAB([0, 10]); break;
                            case '2': this.setRandomIntAB([1, 100]); break;
                            case '3': this.setRandomIntAB([1, 1000]); break;

                            default:
                                console.error('Invalid subtraction difficulty', this.difficulty);
                        }
                        if (this.b > this.a) { // Swap A/B to avoid negative answers
                            tmp = this.a;
                            this.a = this.b;
                            this.b = tmp;
                        }
                    }
                    break;
                case '*': 
                    if (this.tensChallengeActive) {
                        switch (this.difficulty) {
                            case '1': this.setRandomIntAB([0, 10]); break;
                            case '2': this.setRandomIntAB([0, 1000]); break;
                            case '3': this.setRandomIntAB([0, 10000]); break;

                            default:
                                console.error('Invalid multiplication difficulty', this.difficulty);
                        }
                        break;
                    } else {
                        switch (this.difficulty) {
                            case '1': this.setRandomIntAB([0, 10]); break;
                            case '2': this.setRandomIntAB([0, 100], [0, 9]); break;
                            case '3': this.setRandomIntAB([0, 1000]); break;

                            default:
                                console.error('Invalid multiplication difficulty', this.difficulty);
                        }
                        break;
                    }
                case '/': 
                    switch (this.difficulty) {                
                        case '1': this.setRandomIntAB([0, 10], [1, 10]); break;
                        case '2': this.setRandomIntAB([0, 100], [1, 9]); break;
                        case '3': this.setRandomIntAB([0, 100], [1, 10]); break;
                        default:
                            console.error('Invalid division difficulty', this.difficulty);
                    }

                    tmp = this.a * this.b; // Ensure answer is integer
                    this.a = tmp;
                    break;
            }
            
            this.problem = this.a +' '+ operator +' '+ this.b;
            this.correctAnswer = eval(this.a + operator + this.b);
            this.answer = '';
        },
        generatePotentialAnswers() {
            this.potentialAnswers = []
            let numTries = 0
            while (numTries < 100 && this.potentialAnswers.length <= 4) {
                this.generateProblem()
                if (!this.potentialAnswers.includes(this.correctAnswer)) {
                    this.potentialAnswers.push(this.correctAnswer)
                }
            }
            this.shuffleArray(this.potentialAnswers)
        },
        shuffleArray(arr) {
            arr.sort(() => Math.random() - 0.5)
        },
        setAnswer(potentialAnswer) {
            this.answer = potentialAnswer.toString()
        },
        focusInputField() {
            this.$refs.txtAnswer.focus();
        },
        enterPressed() {
            this.answer = '';
        },
        getRandomInt (min, max) {
            let a = Math.floor(Math.random() * (max - min + 1)) + min;
            if (a == 0) { // Should hopefully lower probability of rolling zero
                if (Math.random() > 0.5) {
                    a = this.getRandomInt(min, max); // Do reroll
                }
            }
            return a;
        },
        setRandomIntAB (arrMinMaxA, arrMinMaxB = null) {
            if (!Array.isArray(arrMinMaxB)) {
                arrMinMaxB = arrMinMaxA;
            }

            if (this.tensChallengeActive && this.operator != '/') { // Ugh... ugly hack!
                switch (this.difficulty) {
                    case '1': this.a = 10; break;
                    case '2': this.a = 100; break;
                    case '3': this.a = 1000; break;
                    default: console.error('Invalid addition difficulty', this.difficulty);
                }
            } else {
                this.a = this.getRandomInt(arrMinMaxA[0], arrMinMaxA[1]);
            }

            this.b = this.getRandomInt(arrMinMaxB[0], arrMinMaxB[1]);

            // Avoid repeats of the same problem twice in a row
            if (this.a == this.previousA && this.b == this.previousB) {
                this.setRandomIntAB(arrMinMaxA, arrMinMaxB);
            }

            // Lower the probability of 0, 1 and 10 in multiplication problems
            if (this.activeProblemTypeIndex == 2) { // * multiplication active
                if (this.a == '0' || this.a == '1' || this.a == '10' || this.b == '0' || this.b == '1' || this.b == '10') {
                    if (Math.random() >= 0.25) {
                        this.setRandomIntAB(arrMinMaxA, arrMinMaxB);
                        return;
                    }
                }
            }
        },
    }
}
</script>


<style scoped>
    /* Animations for switching between the text input box and the multiple selection buttons */
    .answer-enter-from,
    .answer-leave-to {
        opacity: 0;
        transform: scale(.2);
    }
    .answer-enter-active,
    .answer-leave-active {
        transition: all .3s ease;
    }

    /* Animations for the math problem flipping when correct answer is entered */
    .problem-enter-from,
    .problem-leave-to {
        transform: rotateX(90deg);
    }
    .problem-enter-active,
    .problem-leave-active {
        transition: all .1s ease;
    }

    input.answer {
        background-color: rgba(255, 255, 255, 1);
        border-radius: 20px;
        border: 0;
        padding: .5em;
        margin: .5em;
        min-width: 250px;
        display: inline-block;
    }
    .problem {
        min-height: 2em;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 20px;
        font-size: 2em;
        font-weight: bold;
        line-height: 2em;
        min-width: 100px;
        display: inline-block;
        margin: .5em;
        padding: 0 .75em;
    }

    .potentialAnswer {
        display: inline-block;
        min-width: 3em;
        margin: .2em;
    }
    .potentialAnswer:hover {
        transform: translateX(-2px) translateY(-2px);
        box-shadow: 3px 3px 5px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    .potentialAnswerContainer {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        margin: .5em;
    }
</style>