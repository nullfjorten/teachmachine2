<template>
    <div class="fraction">
        <div class="fas fa-arrow-up" @click="increaseFraction()"></div>
        <div>
            <span v-if="mod == 0">{{num}}</span>
            <span v-if="mod > 0">
                <span class="faded">{{numerator}}*{{mod}}=</span>{{numerator*mod}}
            </span>
            <span v-if="mod < 0">
                <span class="faded">{{numerator}}:{{mod*-1}}=</span>{{numerator/(mod*-1)}}
            </span>
            <hr>
            <span v-if="mod == 0">{{den}}</span>
            <span v-if="mod > 0">
                <span class="faded">{{denominator}}*{{mod}}=</span>{{denominator*mod}}
            </span>
            <span v-if="mod < 0">
                <span class="faded">{{denominator}}:{{mod*-1}}=</span>{{denominator/(mod*-1)}}
            </span>
        </div>
        <div class="fas fa-arrow-down" @click="decreaseFraction()"></div>
    </div>
</template>

<script>
export default {
    props: {
        numerator: {
            type: String,
            required: true
        },
        denominator: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            // num: this.numerator,
            // den: this.denominator,
            mod: 0
        }
    },
    computed: {
        num: function() {
            if (this.mod == 0) {
                return this.numerator
            } else if (this.mod > 0)  {
                return this.numerator * this.mod
            } else {
                return this.numerator / (this.mod * -1)
            }
        },
        den: function() {
            if (this.mod == 0) {
                return this.denominator
            } else if (this.mod > 0)  {
                return this.denominator * this.mod
            } else {
                return this.denominator / (this.mod * -1)
            }
        }
    },
    methods: {
        increaseFraction() {
            if (this.mod == 0) {
                this.mod = 2
            } else if (this.mod == -1) {
                this.mod = 0
            } else if (this.mod < 0) {
                this.mod++
                while (!this.isDivisible()) {
                    this.mod++
                }
            } else {
                this.mod++
            }
        },
        decreaseFraction() {
            if (this.mod == 2) {
                this.mod = 0
            } else if (this.mod == 0) {
                this.mod = -2
                if (!this.isDivisible()) {
                    this.mod = 0
                    return
                }
            } else if (this.mod > 0) {
                this.mod--;
            } else {
                this.mod--
                while (!this.isDivisible()) {
                    if (this.mod*-1 >= this.numerator || this.mod*-1 >= this.denominator) {
                        console.log('Caught!');
                        this.mod++
                        break
                    }
                    this.mod--
                }
            }
        },
        isDivisible() {
            var positiveMod = null
            if (this.mod == 0) { return false }
            if (this.mod > 0 ) { positiveMod = this.mod }
            if (this.mod < 0 ) { positiveMod = this.mod*-1 }
            console.log('Mod: '+ positiveMod);
            return (this.denominator % positiveMod === 0) && (this.numerator % positiveMod === 0)
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
    font-size: 80%;
}
</style>