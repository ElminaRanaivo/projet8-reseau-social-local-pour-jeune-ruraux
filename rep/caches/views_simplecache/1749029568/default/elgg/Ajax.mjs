import 'jquery';import elgg from 'elgg';import spinner from 'elgg/spinner';import system_messages from 'elgg/system_messages';import security from 'elgg/security';import i18n from 'elgg/i18n';import hooks from 'elgg/hooks';var site_url=elgg.get_site_url(),action_base=site_url+'action/',fragment_pattern=/#.*$/,query_pattern=/\?.*$/,leading_slash_pattern=/^\//,slashes_pattern=/(^\/|\/$)/g;function Ajax(use_spinner){use_spinner=(use_spinner==null)?!0:!!use_spinner;var that=this;var spinner_starts=0;function fetch(options,hook_type){var orig_options,params,jqXHR,metadata_extracted=!1,error_displayed=!1;function extract_metadata(data,status_code){status_code=status_code||200;if(!metadata_extracted){var m=data._elgg_msgs;if(m&&m.error){data.error=m.error}
if(data.error&&options.showErrorMessages){system_messages.error(data.error);error_displayed=!0}
if(data.error||status_code!==200){data.status=-1}else{data.status=0}
m&&m.success&&options.showSuccessMessages&&system_messages.success(m.success);delete data._elgg_msgs;var deps=data._elgg_deps;if(deps&&deps.length){deps.forEach((dep)=>import(dep))}
delete data._elgg_deps;metadata_extracted=!0}}
that._fetch_args={options:options,hook_type:hook_type};hook_type=hook_type||'';if(!$.isPlainObject(options)){throw new Error('options must be a plain object with key "url"')}
if(!options.url&&hook_type!=='path:'){throw new Error('options must be a plain object with key "url"')}
if(options.data===undefined){options.data={}}
if(options.showSuccessMessages===undefined){options.showSuccessMessages=!0}
if(options.showErrorMessages===undefined){options.showErrorMessages=!0}
if($.isPlainObject(options.data)){options.data=options.data||{}}else if(options.data instanceof FormData){options.processData=!1;options.contentType=!1}else{if(typeof options.data!=='string'){throw new Error('if defined, options.data must be a plain object or string')}}
options.dataType='json';orig_options=$.extend({},options);params={options:options};if(hook_type&&typeof options.data!=='string'){options.data=hooks.trigger(Ajax.REQUEST_DATA_HOOK,hook_type,params,options.data)}
if(!options.method){options.method='GET';if(options.data&&!$.isEmptyObject(options.data)){options.method='POST'}}
if(use_spinner){options.beforeSend=function(){orig_options.beforeSend&&orig_options.beforeSend.apply(null,arguments);spinner_starts++;spinner.start()};options.complete=function(){spinner_starts--;if(spinner_starts<1){spinner.stop()}
orig_options.complete&&orig_options.complete.apply(null,arguments)}}
var custom_error=function(){};if(options.error){custom_error=options.error}
options.error=function(jqXHR,textStatus,errorThrown){if(!jqXHR.getAllResponseHeaders()){custom_error(jqXHR,textStatus,errorThrown);return}
try{var data=$.parseJSON(jqXHR.responseText);if($.isPlainObject(data)){extract_metadata(data,jqXHR.status)}}catch(e){if(window.console){console.warn(e.message)}}
if(!error_displayed&&options.showErrorMessages){system_messages.error(i18n.echo('ajax:error'))}
custom_error(jqXHR,textStatus,errorThrown)};options.dataFilter=function(data,type){if(type!=='json'){return data}
data=$.parseJSON(data);extract_metadata(data,200);var params={options:orig_options};if(hook_type){data=hooks.trigger(Ajax.RESPONSE_DATA_HOOK,hook_type,params,data)}
jqXHR.AjaxData=data;if(data.value!==undefined){return JSON.stringify(data.value)}
return JSON.stringify(data)};options.url=elgg.normalize_url(options.url);options.headers={'X-Elgg-Ajax-API':'2'};that._ajax_options=options;jqXHR=$.ajax(options);return jqXHR}
this.path=function(path,options){elgg.assertTypeOf('string',path);if(path.indexOf(site_url)===0){path=path.substring(site_url.length)}
path=path.replace(fragment_pattern,'');assertNotUrl(path);options=options||{};options.url=path;path=path.replace(query_pattern,'').replace(slashes_pattern,'');return fetch(options,'path:'+path)};this.view=function(view,options){elgg.assertTypeOf('string',view);if(view===''){throw new Error('view cannot be empty')}
assertNotUrl(view);options=options||{};options.url='ajax/view/'+view;options.method=options.method||'GET';view=view.replace(query_pattern,'').replace(slashes_pattern,'');return fetch(options,'view:'+view)};this.form=function(action,options){elgg.assertTypeOf('string',action);if(action===''){throw new Error('action cannot be empty')}
action=action.replace(leading_slash_pattern,'').replace(fragment_pattern,'');assertNotUrl(action);options=options||{};options.url='ajax/form/'+action;options.method=options.method||'GET';action=action.replace(query_pattern,'').replace(slashes_pattern,'');return fetch(options,'form:'+action)};this.action=function(action,options){elgg.assertTypeOf('string',action);if(action===''){throw new Error('action cannot be empty')}
if(action.indexOf(action_base)===0){action=action.substring(action_base.length)}
action=action.replace(leading_slash_pattern,'').replace(fragment_pattern,'');assertNotUrl(action);options=options||{};options.data=options.data||{};var m=action.match(/\?(.+)$/);if(m&&/(^|&)__elgg_ts=/.test(m[1])){}else{options.data=security.addToken(options.data)}
options.method=options.method||'POST';options.url='action/'+action;action=action.replace(query_pattern,'').replace(slashes_pattern,'');return fetch(options,'action:'+action)};this.objectify=function(el){$(el).trigger('elgg-ajax-objectify');return new FormData($(el)[0])};this.forward=function(destination){spinner_starts++;spinner.start();elgg.forward(destination)}}
function assertNotUrl(arg){if(/^https?:/.test(arg)){throw new Error('elgg/Ajax cannot be used with external URLs')}}
Ajax.REQUEST_DATA_HOOK='ajax_request_data';Ajax.RESPONSE_DATA_HOOK='ajax_response_data';export default Ajax