<template>
    <div class="cantianer">
        <header>
            <self-info></self-info>
        </header>
        <section>
            <home-menu></home-menu>
        </section>
        <div class="bottom-block"></div>
         <footer>
            <footer-menu></footer-menu>
        </footer>
    </div>
</template>
<script>
import footerMenu from '@/components/FooterMenu'
import selfInfo from '@/components/Home/SelfInfo'
import homeMenu from '@/components/Home/Menu'
export default {
  components:{
      footerMenu,
      selfInfo,
      homeMenu
  },
}
</script>



