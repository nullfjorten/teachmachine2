<template>
    <div class="dark panel">
        <div>
            <h2>{{ problem }} =</h2>
        </div>

        <div>
            <button title="Nullstill svar" @click="answer = ''; focusInputField();">X</button>
            <input type="text" v-model="answer" ref="txtAnswer" pattern="\d*" placeholder="Skriv svaret her">
            <button @click="generateProblem">Nytt problem</button>
        </div>

        <div class="dark panel">
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
                    <button :class="[tensChallengeActive == '1' ? 'active' : '']" @click="toggleTensChallenge(true)" title="Tiervenner">10</button>
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
    <div v-show="true">
        <p>Skann denne QR-koden med mobilen for å få lenken til nettstedet:</p>
        <div>
            <a href="https://teachmachine014.firebaseapp.com">
                <img src="../assets/qr-link.png" alt="QR-kode, link til siden">
            </a>
        </div>
        <p>
            <a href="https://github.com/nullfjorten/teachmachine" target="_blank">Eller klikk her for prosjektets kildekode.</a>
        </p>
    </div>
</template>

<script>
export default {
    created() {
        this.generateProblem();
    },
    mounted () {
    },
    data () {
        return {
            problemTypes: [
                { 'operator': '+', 'heading': '+ Addisjon (pluss)' },
                { 'operator': '-', 'heading': '- Subraksjon (minus)' },
                { 'operator': '*', 'heading': '* Multiplikasjon (gange)' },
                { 'operator': '/', 'heading': '/ Divisjon (dele)' },
            ],
            activeProblemTypeIndex: 2, // 0-4
            randomProblemTypesActivated: false,
            randomProblemTypeHeading: '+ - * / Tilfeldige regnearter',
            difficulty: '1', // '1'-'3'
            points: 0,
            problem: '',
            correctAnswer: '',
            answer: '',
            a: 0,
            b: 0,
            numCorrectAnswers: 0,
            tensChallengeActive: false,
            previousA: null,
            previousB: null,
            showDebug: false,
        }
    },
    computed: {
        operator () {
            return this.problemTypes[this.activeProblemTypeIndex].operator;
        },
        heading () {
            if (this.randomProblemTypesActivated) {
                return this.randomProblemTypeHeading;
            }
            else {
                return this.problemTypes[this.activeProblemTypeIndex].heading;
            }
        },
        isCorrect() {
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
                this.numCorrectAnswers++;
                this.generateProblem();
                return true;
            }
            else {
                return false;
            }
        }
    },
    methods: {
        checkForCommands() {
            if (this.answer === 'debug') {
                this.showDebug = !this.showDebug;
            }
        },
        activateRandomProblemTypes(active = true) {
            this.randomProblemTypesActivated = active;
            this.generateProblem();
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
                    return true; // Changed
                }
            }
            console.error('Invalid problemTypeOperator', problemTypeOperator);
            return false;
        },
        setProblemDifficulty (difficulty) {
            this.difficulty = difficulty;
            this.generateProblem();
        },
        toggleTensChallenge () {
            this.tensChallengeActive = !this.tensChallengeActive;
            this.generateProblem();
        },
        setTensChallenge (active = true) {
            this.tensChallengeActive = active;
        },
        generateProblem () {
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
        focusInputField() {
            this.$refs.txtAnswer.focus();
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
                        //console.log('A: '+ this.a +'. Regenerating.');
                        return;
                    }
                    //console.log('A: '+ this.a +'. Keeping.');
                }
            }
        },
    }
}
</script>


<style scoped>
    /*.color-primary-0 { color: #AF4A0B }	
    .color-primary-1 { color: #E38348 }
    .color-primary-2 { color: #D4621C }
    .color-primary-3 { color: #913700 }
    .color-primary-4 { color: #6B2900 } */

    .dark {
        background: #D4621C;
        background: linear-gradient(352deg, #b44b0a, #d37134);
        color: #111;
    }
    .light {
        background-color: #ffffff44;
    }
    .panel {
        border-radius: 5px;
        padding: 6px;
        margin: 6px;
    }
    button {
        background-color: rgba(30, 56, 136, 1);
        border-color: #555;
        margin: .2em;
        color: #ddd;
        font-weight: bold;
    }
    button.active {
        border: 2px solid #555;
        background-color: rgba(255, 255, 255, 0.4);
        color: rgba(30, 56, 136, 1);
    }
    button i {
        color: #ddd;
    }
    button.active i {
        color: rgba(30, 56, 136, 1);
    }
    button.operator {
        width: 40px;
    }
</style>