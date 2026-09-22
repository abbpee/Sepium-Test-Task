(function ($) {
    'use strict';

    // Выбор категории в товаре и обновление блока характеристик.
    $('body').on('change', '.js-category', function () {
        var category = [];
        var $properties = $('.property_all');

        $(this).closest('.add_good_name_category')
            .toggleClass('category_checked is-selected', this.checked);

        $('.category_checked').each(function () {
            category[category.length] = $(this).attr('data-category-id');
        });

        $properties.addClass('is-loading').attr('aria-busy', 'true');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/property/Refresh_Property_Good.php',
            dataType: 'html',
            data: { category: category },
            success: function (data) {
                if (data != 'no') {
                    var state = {};
                    $properties.find('.name_select_rielt').each(function (i,e) {
                        var propertyId = e.dataset.property;
                        var checkboxes = $(this).find('div.ag_pole_good input[type="checkbox"]');
                        var value;

                        if (checkboxes.length) {
                            value = [];
                            checkboxes.each((i, cbx) => {
                                if (cbx.checked) {
                                    value.push(cbx.nextElementSibling.dataset.val);
                                }
                            });
                        } else {
                            value = $(this).find('input.ag_pole_good, select.ag_pole_good').first().val();
                        }

                        if (value !== undefined && value !== '') {
                            state[propertyId] = value;
                        }
                    });

                    $properties.html(data);
                    $properties.find('.property-field').each(function (i, propertyField) {
                        var currentState = state[propertyField.dataset.property];
                        if (undefined === currentState) {
                            return;
                        }

                        var checkboxes = $(this).find('div.ag_pole_good input[type="checkbox"]');
                        if (checkboxes.length) {
                            checkboxes.each(function() {
                                if (currentState.includes($(this).next().data('val')+'')) {
                                    $(this).prop('checked', true);
                                }
                            });
                        } else {
                            $(this).find('input.ag_pole_good, select.ag_pole_good').first().val(currentState);
                        }
                    });
                }
            },
            error: function () {
                $properties.html('<div class="error-state">Не удалось обновить характеристики.</div>');
            },
            complete: function () {
                $properties.removeClass('is-loading').attr('aria-busy', 'false');
            }
        });
    });
}(jQuery));
