class ShowItems {
    constructor(items) {
        this.current_items = document.querySelectorAll('.c-carousel-item')
        this.item_parent = document.querySelector('.carousel-item-array')
        this.show_count = 0;
        this.carousel_transform = 0;
        this.count = 2
        this.transformed = false;
        this.isMoving = false
        this.isGestureMoving = false // Keeps Carousel from moving when image clicked for modal / popup
        this.ending_point = 0
        this.initialPosition = null
        this.difference = 0
        this.direction = ''
        this.size_changed = true
        this.previous_width = 0
        this.rotate = this.rotate.bind(this)
        this.checkCarouselEnd = this.checkCarouselEnd.bind(this)
        let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        console.log('isMobile:', isMobile)
        if(isMobile) {
            document.querySelector('.c-left-btn').style.display = 'none'
            document.querySelector('.c-right-btn').style.display = 'none'
            document.querySelectorAll('.c-carousel-item').forEach((item => {
                console.log(12)
                item.addEventListener('touchstart', this.gestureStart.bind(this), false)
                item.addEventListener('touchmove', this.gestureMove.bind(this), false);
                item.addEventListener('touchend', this.gestureEnd.bind(this), false);
            }))
        }
    }
    
    checkCarouselEnd() {
        this.item_parent.style.removeProperty('transition')
        const carousel_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        this.isMoving = false
        // Keeps Carousel from moving when image clicked for modal / popup
        this.isGestureMoving = false
        // Makes sure carousel_transform variable is always a positive number to begin with
        this.carousel_transform = this.carousel_transform < 0 ? this.carousel_transform * -1 : this.carousel_transform
        // Runs no matter what when carousel gets to the end
        console.log(this.carousel_transform , this.ending_point)
        if(-this.carousel_transform < -this.ending_point) {
            this.carousel_transform = this.carousel_transform - this.ending_point 
            // this.carousel_transform = this.carousel_transform 
            console.log('this.carousel_transform:', this.carousel_transform)
            
            this.item_parent.style.transform = 'translate3d('+ -this.carousel_transform +'px, 0, 0)'
            console.log('all')
        // Only runs for Even number of items in the carousel for beginning
        } else if (this.carousel_transform === 0) {
            console.log('even')
            this.carousel_transform = this.ending_point
            this.item_parent.style.transform = 'translate3d('+ -this.carousel_transform +'px, 0, 0)'
        // Only runs for Odd number of items in the carousel for beginning
        } else if (this.carousel_transform < carousel_width) {
            console.log('odd')
            this.carousel_transform = this.ending_point + this.carousel_transform
            this.item_parent.style.transform = 'translate3d('+ -this.carousel_transform +'px, 0, 0)'
        }
    }

    
    removeCloned() {
        const cloned = document.querySelectorAll('.cloned')
        const cloned_count = cloned.length
        for(let i = 0; i < cloned_count; i++) this.item_parent.removeChild(cloned[i])
        this.addElement()
    }
    checkWidth() {
        const wW = window.innerWidth
        if (this.previous_width !== document.querySelector('.c-carousel-wrap').getBoundingClientRect().width) this.size_changed = true
        if (!this.size_changed) return

        switch (true) {
            case wW > 768 :
                this.show_count = 2
                this.removeCloned()
                break;
            case wW <= 767:
                this.show_count = 1
                this.removeCloned()
        }
        this.size_changed = false
        this.previous_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
    }
    addElement() {
        const carousel_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width

        if (this.transformed) {
            // carousel_transform updates when screen resized manually
            this.carousel_transform = this.count * carousel_width
        } else {
            // On page load this only runs below || if carousel hasn't been tranformed yet
            this.carousel_transform = carousel_width
            
        }
        
        const current_items_length = this.current_items.length
        let cloneStart = current_items_length - this.show_count
        
        // Clone elements add to Document
        for (let i = 0; i < current_items_length; i++) {
            let el = this.current_items[i]

            // Adds shown item amount to beginning of current items
            console.log(i , cloneStart)
            if (i >= cloneStart) {
                let cloned = el.cloneNode(true)
                cloned.className += " cloned"
                this.item_parent.insertBefore(cloned, this.current_items[0])
            }

            let cloned = el.cloneNode(true)
            cloned.className += " cloned"
            this.item_parent.appendChild(cloned)
        }

        const carousel_items = document.querySelectorAll('.c-carousel-item')
        let newItemsLength = carousel_items.length

        const carousel_array_width = carousel_width / this.show_count * carousel_items.length
        const item_width = carousel_width / this.show_count
        console.log('this.carousel_transform:', this.carousel_transform + item_width)
        this.ending_point = item_width * current_items_length

        // *** AFTER CAROUSEL IS ROTATED; CHECKS IF IT'S THE END OR BEGINNING, IF SO UPDATES BACK TO STARTING POSITION ***
        this.checkCarouselEnd()
        this.item_parent.style.width = carousel_array_width + 'px'
        this.item_parent.style.transform = 'translate3d(' + -this.carousel_transform + 'px, 0, 0)'

        while (newItemsLength--) {
            carousel_items[newItemsLength].style.width = item_width + 'px'
        }
    }
    rotate(ev, touchX) {
        if(this.isMoving) return

        const wW = window.innerWidth
        const target = ev.target.className
        const carousel_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        this.transformed = true
        console.log('target:', target, this.direction)
        if(target === 'c-left-btn' || this.direction === 'left') {
            this.count++
            const x = touchX ? -(this.carousel_transform -= touchX) : this.carousel_transform += carousel_width

            this.item_parent.style.transform = 'translate3d('+ -x +'px, 0, 0)'
            this.item_parent.style.transition = wW < 768 ? 'transform .35s ease-out' :'transform .5s ease-out'
        } else {
            this.count--
            const x =  touchX ? -(this.carousel_transform += touchX) : this.carousel_transform -= carousel_width
            this.item_parent.style.transition = wW < 768 ? 'transform .35s ease-out' :'transform .5s ease-out'
            this.item_parent.style.transform = 'translate3d('+ -x + 'px, 0, 0)'
        }
        this.isMoving = true
        this.item_parent.addEventListener('transitionend', this.checkCarouselEnd)
    }
    gestureStart(e) {
        console.log('e:', e)
        this.initialPosition = e.changedTouches[0].pageX;
        // On every first touch updates container transform X
        this.initialCarouselTransform = Number(document.querySelector('.carousel-item-array').style.transform.replace(/(translate3d)+\(([-\d.]+)px(.*)/gi, '$2') ) * -1
    }
    gestureMove(e) {
        if(this.isMoving) return
        let pageX = e.changedTouches[0].pageX
        let previous = pageX - this.initialPosition
        
        // Updates which direction to rotate
        this.direction = previous > this.difference ? 'right' : 'left'
        this.difference = pageX - this.initialPosition

        this.carousel_transform = -this.initialCarouselTransform + this.difference
        this.item_parent.style.transform = 'translateX('+ this.carousel_transform +'px)'
        this.isGestureMoving = true // Keeps Carousel from moving when image clicked for modal / popup
    }
    gestureEnd(e) {
        // Keeps Carousel from moving when image clicked for modal / popup
        if(!this.isGestureMoving) return
        const carousel_wrap_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        if(this.direction === 'left') {
            const touchX = carousel_wrap_width + this.difference
            this.rotate(e, touchX)
        } else {
            const touchX = carousel_wrap_width + -this.difference
            this.rotate(e, touchX)
        }
    }
}

export { ShowItems }

