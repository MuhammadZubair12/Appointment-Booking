$(window).on('load', function() {
    frappe.after_ajax(function () {
            $('#enroll').attr('style', 'display: block !important');
     
    })
})