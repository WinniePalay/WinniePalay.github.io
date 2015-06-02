$(document).ready(function () {

    var item,
        img,
        title,
        large_img,
        CW,
        CH,
        CL,
        CT,
        hpadding,
        vpadding,
        imgtag,
        lb_loading = false,
        doc = $(document);

    /**
     * WINNIE, here is how to do it!
     * @description
     * So what I'm doing is checking if there is a href tag on the LI element.
     * Look below in lightbox li for the other.
     */
    $('li[href]').on('click', function () {
        var item = $(this);
        window.open(item.attr('href') + '?version=' + (new Date()).toString(), '_blank');
    });



    $("#lightbox li").on('click', function () {

        if (lb_loading) return false;


        lb_loading = true;


        var item = $(this),
            img = item.find("img"),
            title = item.find(".title").html();

        // If it has that attribute of href then go ahead and stop this function from running.
        if (item.attr('href')) {
            return;
        }


        $("#lightbox li.show.active").removeClass("active");


        item.addClass("active");


        large_img = new Image();


        large_img.src = img.attr("data-large") ? img.attr("data-large") : img.attr("src");


        if ($(".lb_backdrop").length < 1) {
            var lb_backdrop = '<div class="lb_backdrop"></div>',
                lb_canvas = '<div class="lb_canvas"></div>',
                lb_previous = '<span class="lb_previous"><</span>',
                lb_title = '<span class="lb_title"></span>',
                lb_next = '<span class="lb_next">></span>',
                lb_controls = '<div class="lb_controls">' + lb_previous + lb_title + lb_next + '</div>',
                total_html = lb_backdrop + lb_canvas + lb_controls;

            $(total_html).appendTo("body");
        }


        if ($(".lb_backdrop:visible").length == 0) {
            $(".lb_backdrop, .lb_canvas, .lb_controls").fadeIn("slow");
        }

        if (!large_img.complete)
            $(".lb_canvas").addClass("loading").children().css("opacity", "0.5")


        if (item.prev().length == 0)
            $(".lb_previous").addClass("inactive");
        else
            $(".lb_previous").removeClass("inactive");


        if (item.next().length == 0)
            $(".lb_next").addClass("inactive");
        else
            $(".lb_next").removeClass("inactive");


        CW = $(".lb_canvas").outerWidth();
        CH = $(".lb_canvas").outerHeight();


        CL = ($(window).width() - CW) / 2;
        CT = ($(window).height() - CH) / 2;

        $(".lb_canvas").css({
            top: CT,
            left: CL
        });


        $(large_img).load(function () {

            CW = large_img.width;
            CH = large_img.height;

            hpadding = parseInt($(".lb_canvas").css("paddingLeft")) + parseInt($(".lb_canvas").css("paddingRight"));
            vpadding = parseInt($(".lb_canvas").css("paddingTop")) + parseInt($(".lb_canvas").css("paddingBottom"));
            CL = ($(window).width() - CW - hpadding) / 2;
            CT = ($(window).height() - CH - vpadding) / 2;



            $(".lb_canvas").html("").animate({
                width: CW,
                height: CH,
                top: CT,
                left: CL
            }, 500, function () {


                imgtag = '<img src="' + large_img.src + '" style="opacity: 0;" />';
                $(".lb_canvas").html(imgtag);
                $(".lb_canvas img").fadeTo("slow", 1);


                $(".lb_title").html(title);

                lb_loading = false;
                $(".lb_canvas").removeClass("loading");
            })
        })
    })


    doc.on("click", ".lb_previous", function () {
        navigate(-1)
    });
    doc.on("click", ".lb_next", function () {
        navigate(1)
    });
    doc.on("click", ".lb_backdrop", function () {
        navigate(0)
    });


    doc.keyup(function (e) {

        if ($(".lb_backdrop:visible").length == 1) {
            //Left
            if (e.keyCode == "37") navigate(-1);
            //Right
            else if (e.keyCode == "39") navigate(1);
            //Esc
            else if (e.keyCode == "27") navigate(0);
        }
    });

    //Navigation function
    function navigate(direction) {
        if (direction == -1) // left
            $("#lightbox li.show.active").prev().trigger("click");
        else if (direction == 1) //right
            $("#lightbox li.show.active").next().trigger("click");
        else if (direction == 0) //exit
        {
            $("#lightbox li.show.active").removeClass("active");
            $(".lb_canvas").removeClass("loading");
            $(".lb_backdrop, .lb_canvas, .lb_controls").fadeOut("slow", function () {

                $(".lb_canvas, .lb_title").html("");
            })
            lb_loading = false;
        }
    }
});
