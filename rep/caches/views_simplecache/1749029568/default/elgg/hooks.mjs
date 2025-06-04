import 'jquery';import elgg from 'elgg';var index=0;var hooks={};function prepareHook(name,type){hooks[name]=hooks[name]||[];hooks[name][type]=hooks[name][type]||[];hooks.all=hooks.all||[];hooks[name].all=hooks[name].all||[];hooks.all[type]=hooks.all[type]||[];hooks.all.all=hooks.all.all||[]}
export default{reset:function(){hooks=[]},register:function(name,type,handler,priority){elgg.assertTypeOf('string',name);elgg.assertTypeOf('string',type);elgg.assertTypeOf('function',handler);if(!name||!type){return!1}
prepareHook(name,type);hooks[name][type].push({priority:priority,index:index++,handler:handler});return!0},trigger:function(name,type,params,value){elgg.assertTypeOf('string',name);elgg.assertTypeOf('string',type);value=(value!=null)?value:null;var registrations=[],push=Array.prototype.push;prepareHook(name,type);if(hooks[name][type].length){if(name!=='all'&&type!=='all'){push.apply(registrations,hooks[name][type])}}
if(hooks.all[type].length){if(type!=='all'){push.apply(registrations,hooks.all[type])}}
if(hooks[name].all.length){if(name!=='all'){push.apply(registrations,hooks[name].all)}}
if(hooks.all.all.length){push.apply(registrations,hooks.all.all)}
registrations.sort(function(a,b){if(a.priority<b.priority){return-1}
if(a.priority>b.priority){return 1}
return(a.index<b.index)?-1:1});$.each(registrations,function(i,registration){var handler_return=registration.handler(name,type,params,value);if(handler_return!=null){value=handler_return}});return value}}