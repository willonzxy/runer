<template>
    <div class="container">
        <header>
            <our-logo></our-logo>
        </header>
        <section>
            <my-carousel></my-carousel>
            <my-alert></my-alert>
            <my-tabs></my-tabs>
        </section>
        <div class="bottom-block"></div>
        <footer>
            <footer-menu></footer-menu>
        </footer>
        <float-dot></float-dot>
    </div>
</template>

<script>
import footerMenu from '@/components/FooterMenu'
import ourLogo from '@/components/Index/Logo'
import myCarousel from '@/components/Index/Carousel'
import myTabs from '@/components/Index/Tabs'
import myAlert from '@/components/Index/Alert'
import floatDot from '@/components/Index/floatDot'
export default {
  components:{
    footerMenu,
    ourLogo,
    myCarousel,
    myTabs,
    myAlert,
    floatDot
  }
}
</script>


