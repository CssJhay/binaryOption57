(function($) {

    $(document).ready(function() {
		
		/* ----------------------------------------------------------- */
		/*  WIDGET DATA FROM BITCOIN.COM
		/* ----------------------------------------------------------- */
		
		(function(b, i, t, C, O, I, N) {
			window.addEventListener("load", function() {
				if (b.getElementById(C)) return;
				I = b.createElement(i), N = b.getElementsByTagName(i)[0];
				I.src = t;
				I.id = C;
				N.parentNode.insertBefore(I, N);
			}, false)
		})(document, "script", "https://widgets.bitcoin.com/widget.js", "btcwdgt");
		
		/* ----------------------------------------------------------- */
		/*  VARIABLES FOR SELECT INPUT AND BITCOIN CALCULATOR FORM
		/* ----------------------------------------------------------- */
		
		var userAgent = navigator.userAgent.toLowerCase(),
        plugins = {
            selectFilter: $("#currency-select"),
            btcCalculator: $("#bitcoin-calculator"),
        };
		
		
		/* ----------------------------------------------------------- */
		/*  REPLACE OLD SELECT IN BITCOIN CALCULATOR FORM
		/* ----------------------------------------------------------- */

        if (plugins.selectFilter.length) {
            for (var i = 0; i < plugins.selectFilter.length; i++) {
                var select = $(plugins.selectFilter[i]);
                select.select2({
                    placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
                    minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : 10,
                    maximumSelectionSize: 3,
                    dropdownCssClass: select.attr("data-dropdown-class") ? select.attr("data-dropdown-class") : ""
                });
            }
        }
		
		/* ----------------------------------------------------------- */
		/*  BITCOIN CALCULATOR [ WWW.BLOCKCHAIN.INFO API ]
		/* ----------------------------------------------------------- */
		
        if (plugins.btcCalculator.length) {

            $.getJSON("https://blockchain.info/ticker", function(btcJsonData) {
				var currencyList = [];
				var index = 0;

				for (var currency in btcJsonData) {
					currencyList.push({
						"id": index,
						"text": currency
					});
					index++;
				}

				for (var i = 0; i < plugins.btcCalculator.length; i++) {
					var btcForm = $(plugins.btcCalculator[i]),
						btcFormInput = $(btcForm.find('[name="btc-calculator-value"]')),
						btcFormOutput = $(btcForm.find('[name="btc-calculator-result"]')),
						btcFormCurrencySelect = $(btcForm.find('[name="btc-calculator-currency"]'));

					btcFormCurrencySelect.select2({
						placeholder: btcFormCurrencySelect.attr("data-placeholder") ? btcFormCurrencySelect.attr("data-placeholder") : false,
						minimumResultsForSearch: btcFormCurrencySelect.attr("data-minimum-results-search") ? btcFormCurrencySelect.attr("data-minimum-results-search") : 50,
						maximumSelectionSize: 3,
						dropdownCssClass: btcFormCurrencySelect.attr("data-dropdown-class") ? btcFormCurrencySelect.attr("data-dropdown-class") : '',
						data: currencyList
					});

					if (btcFormInput.length && btcFormOutput.length) {
						// BTC => Currency
						(function(btcFormInput, btcFormOutput, btcFormCurrencySelect) {
							var lastChanged = 'btc';

							btcFormInput.on('input', function() {
								// store current positions in variables
								var selectionStart = this.selectionStart,
									selectionEnd = this.selectionEnd;

								this.value = toCryptoCurrencyFormat(this.value);

								// restore cursor position
								this.setSelectionRange(selectionStart, selectionEnd);

								btcFormOutput.val(toCurrencyFormat('' + btcJsonData[btcFormCurrencySelect.select2('data')[0].text]["buy"] * this.value));
								lastChanged = 'btc';
							});

							// Currency => BTC
							btcFormOutput.on('input', function() {
								// store current positions in variables
								var selectionStart = this.selectionStart,
									selectionEnd = this.selectionEnd;

								this.value = toCurrencyFormat(this.value);

								// restore cursor position
								this.setSelectionRange(selectionStart, selectionEnd);

								btcFormInput.val(toCryptoCurrencyFormat('' + this.value / btcJsonData[btcFormCurrencySelect.select2('data')[0].text]["sell"]));
								lastChanged = 'currency';
							});

							btcFormInput.trigger('input');
							btcFormOutput.blur();

							btcFormCurrencySelect.on('change', function() {
								if (lastChanged === 'btc') {
									btcFormOutput.val(toCurrencyFormat('' + btcJsonData[btcFormCurrencySelect.select2('data')[0].text]["buy"] * btcFormInput.val()));
								} else {
									btcFormInput.val(toCryptoCurrencyFormat('' + btcFormOutput.val() / btcJsonData[btcFormCurrencySelect.select2('data')[0].text]["sell"]));
								}
							});
						})(btcFormInput, btcFormOutput, btcFormCurrencySelect);
					}
				}
			})
			.fail(function() {
				console.log('Error while fetching data from https://blockchain.info/ticker');
			});
		}

		function toCurrencyFormat(stringValue) {
			var value = parseFloat(stringValue.replace(/[^\d.]/g, '')).toFixed(2);
			return $.isNumeric(value) ? value : 0;
		}

		function toCryptoCurrencyFormat(stringValue) {
			var value = stringValue.replace(/[^\d.]/g, '');
			return $.isNumeric(value) ? value : 0;
		}

		
		/* ----------------------------------------------------------- */
		/*  NUMBER SPINNER HORIZONTAL [ QUANTITY IN SHOPPING CART PAGE ]
		/* ----------------------------------------------------------- */
		
		var fieldName;
		// This button will increment the value
		$(".qtyplus").on("click", function(e){
			// Stop acting like a button
			e.preventDefault();
			// Get the field name
			fieldName = $(this).attr("data-field");
			// Get its current value
			var currentVal = parseInt($("input[name="+fieldName+"]").val(),10 );
			// If is not undefined
			if (!isNaN(currentVal)) {
				// Increment
				$("input[name="+fieldName+"]").val(currentVal + 1);
			} else {
				// Otherwise put a 0 there
				$("input[name="+fieldName+"]").val(0);
			}
		});
		// This button will decrement the value till 0
		$(".qtyminus").on("click", function(e) {
			// Stop acting like a button
			e.preventDefault();
			// Get the field name
			fieldName = $(this).attr("data-field");
			// Get its current value
			var currentVal = parseInt($("input[name="+fieldName+"]").val(),10 );
			// If it isn't undefined or its greater than 0
			if (!isNaN(currentVal) && currentVal > 1) {
				// Decrement one
				$("input[name="+fieldName+"]").val(currentVal - 1);
			} else if (currentVal == 0) {
				$("input[name="+fieldName+"]").val(1);
			}
			
			else {
				// Otherwise put a 1 there
				$("input[name="+fieldName+"]").val(1);
			}
		});
		
		

	});
	
	$(window).on("load", function() {
		
		/* ----------------------------------------------------------- */
		/*  BITCOIN PRELOADER
		/* ----------------------------------------------------------- */
		
        if ($("#preloader")[0]) {
            $("#preloader").delay(1000).fadeTo(1000, 0, function() {
                $(this).remove();
            });
        }
		
    });
		
		/* ----------------------------------------------------------- */

})(jQuery);