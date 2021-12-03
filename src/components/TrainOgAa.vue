<template>
    <div class="panel dark backgroundPanel left">
        <h1><em>Å</em> eller <em>og</em></h1>
        
        <!-- <component v-bind:is="processedHtml"></component> -->

        <!-- <v-runtime-template :template="template"></v-runtime-template>

        <p v-if="activeElement == 1">Det er digg <og-aa correct="aa" /> spise når man er sulten.</p>
        <p v-if="activeElement == 2">Liker du erter <og-aa  correct="og" /> poteter?</p>
        <p v-if="activeElement == 3">Gikk du for <og-aa  correct="aa" /> finne mer mat?</p>
        <p v-if="activeElement == 4">Vil du gå <og-aa  correct="og" /> spise nå?</p>
        <p v-if="activeElement == 5">Jeg liker <og-aa  correct="aa" /> spise <og-aa  correct="og" /> drikke i godt selskap.</p> -->

        <span v-for="(subElement, key) in this.getSubElements(this.activeElement)" :key="key">
            <span v-if="subElement.toLowerCase() == 'og' || subElement.toLowerCase() == 'å'">
                <button class="choice" :class="{ active: selection == 1 }" @click="selection = 1">og</button>
                <button class="choice" :class="{ active: selection == 2 }" @click="selection = 2">å</button>
            </span>
            <span v-else>
                {{ subElement }}&nbsp;
            </span>
        </span>
        
    </div>    
</template>

<script>
// import VRuntimeTemplate from 'v-runtime-template'
// import OgAa from '@/components/OgAa.vue'

export default {
    components: {
        // VRuntimeTemplate,
        // OgAa
    },
    data() {
        return {
            activeElement: 3,
            elements: [
                'Det er digg å spise når man er sulten.',
                'Liker du erter og poteter?',
                'Gikk du for å finne mer mat?',
                'Å spise er skikkelig digg.',
                'Og hva sa du deretter?',
                'Vet du hva det er du og?'
            ],
            template: `
                test <og-aa></og-aa> slike ting
            `
        }
    },
    methods: {
        getSubElements(element) {
            return this.elements[element].split(' ')
        }
    },
    computed: {
        // processedHtml () {
        //     let html = 'Jeg spiser og drikker.'
        //     html = html.replace('og', '<OgAa></OgAa>');
        //     return {
        //         template: '<div>' + html + '</div>'
        //     }
        // }
    }
}
</script>

<style scoped>
    .choices {
        display: inline-block;
    }
    .choices > button {
        min-width: 4em;
        padding: .2em;
    }

    .ogaa-enter-from,
    .ogaa-leave-to {
        transform: rotateX(90deg);
    }
    .ogaa-enter-active,
    .ogaa-leave-active {
        transition: all .05s ease;
    }

</style>