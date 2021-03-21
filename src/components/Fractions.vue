<template>
    <h1>Brøk</h1>
    <div class="container">
        <single-fraction numerator=2 denominator=4 />
        <div>+</div>
        <single-fraction numerator=5 denominator=3 />
        <div>+</div>
        <single-fraction numerator=180 denominator=180 />
        <div>=</div>
        <input type="text">
    </div>
</template>

<script>
import SingleFraction from '@/components/fractions/SingleFraction.vue'
export default {
    components: {
        SingleFraction
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
input[type=text] {
    width: 40px;
    margin-left: 5px;
}
</style>