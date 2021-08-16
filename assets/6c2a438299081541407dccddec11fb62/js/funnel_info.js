document.addEventListener('DOMContentLoaded', function () {
    if (!$.Kilgore.isAuthed) {
        $('form button[type="submit"]:not([disabled])').addClass('disable-overlay').prop('disabled',true);
        $.Kilgore.PROXY.getFunnelInfo(function (response) {
            if (response.status) {
                $.Kilgore.isAuthed = true;
                $('form button.disable-overlay').removeClass('disable-overlay').prop('disabled',false);
                document.dispatchEvent($.Kilgore.PROXY.createNewEvent('funnelAuthed'));
            } else {
                alert('Funnel is not authorized');
            }
        }, function(error) {
            alert('Funnel is not authorized');
        });
    } else {
        document.dispatchEvent($.Kilgore.PROXY.createNewEvent('funnelAuthed'));
    }
});
