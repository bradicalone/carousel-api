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
        this.intervalId = []
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        document.querySelectorAll('.c-carousel-item').forEach((item => {

            if (this.isMobile) {
                document.querySelector('.c-left-btn').style.display = 'none'
                document.querySelector('.c-right-btn').style.display = 'none'

                item.addEventListener('touchstart', this.gestureStart.bind(this), false)
                item.addEventListener('touchmove', this.gestureMove.bind(this), false);
                item.addEventListener('touchend', this.gestureEnd.bind(this), false);
            } else {
                this.startAuto()
                this.item_parent.addEventListener('mouseenter', e => {
                    this.removeAuto()
                })
            }
        }))
    }

    removeAuto() {
        this.intervalId.forEach(id => clearInterval(id))
        this.intervalId = []
    }

    startAuto() {
        this.intervalId.push(setInterval(this.rotate, 4000)) 
    }

    checkCarouselEnd() {
        this.item_parent.style.removeProperty('transition')
        const carousel_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        this.isMoving = false

        this.carousel_transform = this.carousel_transform < 0 ? this.carousel_transform * -1 : this.carousel_transform
        // Runs no matter what when carousel gets to the end
        if (-this.carousel_transform < -this.ending_point) {
            this.carousel_transform = this.carousel_transform - this.ending_point
            this.item_parent.style.transform = 'translate3d(' + -this.carousel_transform + 'px, 0, 0)'
            // Only runs for Even number of items in the carousel for beginning
        } else if (this.carousel_transform === 0) {
            this.carousel_transform = this.ending_point
            this.item_parent.style.transform = 'translate3d(' + -this.carousel_transform + 'px, 0, 0)'
            // Only runs for Odd number of items in the carousel for beginning
        } else if (this.carousel_transform < carousel_width) {
            this.carousel_transform = this.ending_point + this.carousel_transform
            this.item_parent.style.transform = 'translate3d(' + -this.carousel_transform + 'px, 0, 0)'
        }
    }

    getSmallest(items) {
        let i = items.length
        // Remove height, so the auto height can be calculated for the largest height 
        while(i--) items[i].style.height = '' ;
        let length = items.length
        let previousHeight = items[0].getBoundingClientRect().height
        
        for(let i = 0; i < length;i++) {
            let height = items[i].getBoundingClientRect().height

            if(height < previousHeight) previousHeight = height
        }

        document.querySelector('.carousel-item-array').style.height = previousHeight + 'px'
        return previousHeight
    }

    removeCloned() {
        const cloned = document.querySelectorAll('.cloned')
        const cloned_count = cloned.length
        for (let i = 0; i < cloned_count; i++) this.item_parent.removeChild(cloned[i])
        this.addElement()
    }

    checkWidth() {
        const wW = window.innerWidth
        if (this.previous_width !== document.querySelector('.c-carousel-wrap').getBoundingClientRect().width) this.size_changed = true
        if (!this.size_changed) return

        switch (true) {
            case wW > 768:
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
        const item_height = this.getSmallest(document.querySelectorAll('.c-carousel-item .carousel-image')) 
        const carousel_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        
        if (this.transformed) {
            // carousel_transform updates when screen resized manually
            this.carousel_transform = this.count * carousel_width
        } else
            // On page load this only runs below || if carousel hasn't been tranformed yet
            this.carousel_transform = carousel_width

        const current_items_length = this.current_items.length
        let cloneStart = current_items_length - this.show_count

        // Clone elements add to Document
        for (let i = 0; i < current_items_length; i++) {
            let el = this.current_items[i]

            // Adds shown item amount to beginning of current items
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
        this.ending_point = item_width * current_items_length
        
        // *** AFTER CAROUSEL IS ROTATED; CHECKS IF IT'S THE END OR BEGINNING, IF SO UPDATES BACK TO STARTING POSITION ***
        this.checkCarouselEnd()
        this.item_parent.style.width = carousel_array_width + 'px'
        this.item_parent.style.transform = 'translate3d(' + -this.carousel_transform + 'px, 0, 0)'

        while (newItemsLength--) {
            carousel_items[newItemsLength].style.width = item_width + 'px'
            carousel_items[newItemsLength].style.height = item_height + 'px'
        }
    }

    rotate(ev, touchX) {
        if (this.isMoving) return

        const wW = window.innerWidth
        const target = ev?.target?.className || 'c-left-btn'
 
        const carousel_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        this.transformed = true

        if (target === 'c-left-btn' || this.direction === 'left') {
            this.count++
            const x = touchX ? -(this.carousel_transform -= touchX) : this.carousel_transform += carousel_width

            this.item_parent.style.transform = 'translate3d(' + -x + 'px, 0, 0)'
            this.item_parent.style.transition = wW < 768 ? 'transform .35s ease-out' : 'transform .5s ease-out'
        } else {
            this.count--
            const width = this.carousel_transform < carousel_width ? carousel_width / 2 : carousel_width
            const x = touchX ? -(this.carousel_transform += touchX) : this.carousel_transform -= width
            this.item_parent.style.transition = wW < 768 ? 'transform .35s ease-out' : 'transform .5s ease-out'
            this.item_parent.style.transform = 'translate3d(' + -x + 'px, 0, 0)'
        }

        this.isMoving = true
        this.item_parent.addEventListener('transitionend', this.checkCarouselEnd)
    }

    gestureStart(e) {
        this.initialPosition = e.changedTouches[0].pageX;
        this.initialCarouselTransform = Number(document.querySelector('.carousel-item-array').style.transform.replace(/(translate3d)+\(([-\d.]+)px(.*)/gi, '$2')) * -1
    }

    gestureMove(e) {
        if (this.isMoving) return
        let pageX = e.changedTouches[0].pageX
        let previous = pageX - this.initialPosition

        this.direction = previous > this.difference ? 'right' : 'left'
        this.difference = pageX - this.initialPosition

        this.carousel_transform = -this.initialCarouselTransform + this.difference
        this.item_parent.style.transform = 'translateX(' + this.carousel_transform + 'px)'
        this.isGestureMoving = true // Keeps Carousel from moving when image clicked for modal / popup
    }

    gestureEnd(e) {
        // Keeps Carousel from moving when image clicked for modal / popup
        if (!this.isGestureMoving) return
        const carousel_wrap_width = document.querySelector('.c-carousel-wrap').getBoundingClientRect().width
        if (this.direction === 'left') {
            const touchX = carousel_wrap_width + this.difference
            this.rotate(e, touchX)
        } else {
            const touchX = carousel_wrap_width + -this.difference
            this.rotate(e, touchX)
        }
    }
}

export { ShowItems}

