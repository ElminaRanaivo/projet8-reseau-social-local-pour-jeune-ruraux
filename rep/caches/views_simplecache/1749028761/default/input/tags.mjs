import 'jquery';import '../tagify/tagify.js';export default{init:function(selector){if(!$(selector).length){return}
var defaults={originalInputValueFormat:valuesArr=>valuesArr.map(item=>item.value).join(','),templates:{input(){var _s=this.settings,placeholder=_s.placeholder||'';return `<span ${!_s.readonly && _s.userInput ? 'contenteditable' : ''} tabIndex="0" data-placeholder="${placeholder}" aria-placeholder="${placeholder}"
						class="${_s.classNames.input}"
						role="textbox"
						autocapitalize="false"
						autocorrect="off"
						aria-labelledby="${_s.labbeledby || ''}"
						aria-autocomplete="both"
						aria-multiline="${_s.mode=='mix'?true:false}"></span>`}}};$(selector).each(function(index,elem){var opts=$(elem).data('tagifyOpts')||{};opts=$.extend({},defaults,opts);const label_id=$(elem).attr('id')+'-field-label';if($('#'+label_id).length){opts.labbeledby=label_id}
new Tagify(elem,opts)})}}