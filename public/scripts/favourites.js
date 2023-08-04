$().ready(() => {
  $('.fa-heart').on('click', (e) => {
    const $heart = $(e.target);
    const mapId = $heart.attr('data-map-id');
    const userId = $heart.attr('data-user-id');

    $.ajax({
      method: 'POST',
      url: `/users/${userId}/favourites`,
      data: { map_id: mapId }
    })
      .then((res) => {
        console.log('fervreted');
        $($heart).toggleClass('favourite');
      });
  });
});
