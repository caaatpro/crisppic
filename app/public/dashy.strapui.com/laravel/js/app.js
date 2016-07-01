$(function() {
    // Sidebar Tabs
    $('#navTabs .sidebar-top-nav a').click(function(e) {
        e.preventDefault()
        $(this).tab('show');

        setTimeout(function() {
            $('.tab-content-scroller').perfectScrollbar('update');
        }, 10);

    });

    $('.subnav-toggle').click(function() {
        $(this).parent('.sidenav-dropdown').toggleClass('show-subnav');
        $(this).find('.fa-angle-down').toggleClass('fa-flip-vertical');

        setTimeout(function() {
            $('.tab-content-scroller').perfectScrollbar('update');
        }, 500);

    });

    $('.sidenav-toggle').click(function() {
        $('#app-container').toggleClass('push-right');

        setTimeout(function() {
            $('.tab-content-scroller').perfectScrollbar('update');
        }, 500);

    });

    // Boxed Layout Toggle
    $('#boxed-layout').click(function() {

        $('body').toggleClass('box-section');

        var hasClass = $('body').hasClass('box-section');

        $.get('/api/change-layout?layout=' + (hasClass ? 'boxed' : 'fluid'));

    });


    $('.tab-content-scroller').perfectScrollbar();
});
