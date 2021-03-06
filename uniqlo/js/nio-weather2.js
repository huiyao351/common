/**
 * Created with JetBrains WebStorm.
 * User: Mos
 * Date: 13-5-30
 * Time: 上午11:40
 * To change this template use File | Settings | File Templates.
 */
jQuery(function($){

var weather = {
	tips : [
		'请注意防暑降温，宜穿短袖、背心、短裙、短裤、薄型T恤',
		'午时避免在户外久留，穿短裙/裤、短套装、T恤、长绒棉短袖',
		'薄型棉杉+牛仔裤/休闲裤，或针织连衣裙是不错的选择',
		'白天穿长袖衬衫+薄型套装，配牛仔衫裤，晚上加件针织衫吧',
		'美利奴毛衣、混纺/羊毛/羊绒衫、风衣、连帽茄克赶紧穿起来',
		'羽绒服或羊毛混纺短大衣，内配精纺美利奴毛衣+围巾',
		'宜穿厚羽绒服、摇粒绒外套+羽绒背心，配上帽子和手套'
	],
	time : function(){
		var
			now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth(),
			date = now.getDate(),
			day = now.getDay(),
			arr = ['周日','周一','周二','周三','周四','周五','周六'],
			second = new Date(year, month, date + 1),
			third  = new Date(year, month, date + 2),
			forth  = new Date(year, month, date + 3),
			fifth  = new Date(year, month, date + 4),
			sixth  = new Date(year, month, date + 5);

		return [
			{
				day : arr[day],
				year: year,
				month: month + 1,
				date: date
			},
			{
				day : arr[second.getDay()],
				year: second.getFullYear(),
				month:second.getMonth() + 1,
				date: second.getDate()
			},
			{
				day : arr[third.getDay()],
				year: third.getFullYear(),
				month:third.getMonth() + 1,
				date: third.getDate()
			},
			{
				day : arr[forth.getDay()],
				year: forth.getFullYear(),
				month:forth.getMonth() + 1,
				date: forth.getDate()
			},
			{
				day : arr[fifth.getDay()],
				year: fifth.getFullYear(),
				month:fifth.getMonth() + 1,
				date: fifth.getDate()
			},
			{
				day : arr[sixth.getDay()],
				year: sixth.getFullYear(),
				month:sixth.getMonth() + 1,
				date: sixth.getDate()
			}
		]
	},
	format : function(n){
		return (n < 10 ? '0' : '') + n;
	},
	ajax : function(code, option){
		var that = this,
			city = option.city,
			url = "http://query.yahooapis.com/v1/public/yql?callback=?",
			query = "select * from json where url='http://m.weather.com.cn/data/";

		if(this[city]){
			return this.setText(this[city], option);
		}
		$.getJSON(
			url,
			{
				q: query + code + ".html'",
				format: "json"
			},
			function (data, textStatus, jqXHR) {
				// if(data && data.query && data.query.results){
				// 	that.setText(data.query.results.weatherinfo, option);
				// } else {
					console.warn('请注意，首选天气接口获取数据失败，已切换至备用接口！')
					// throw new Error('no such code: ' + code);
					that.ajax2(option)
				// }
			}
		);
	},
	ajax2: function(option){
// 	http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=4&city=北京
		var script = document.createElement('script'), that = this;
		script.type = 'text/javascript'
		script.charset = 'gb2312'
		script.src = 'http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=4&city=' + option.city
		document.body.appendChild(script)

		setTimeout(function iterator(){
			if(typeof SWther == 'undefined'){
				return setTimeout(iterator, 500)
			}
			makeInfo(SWther.w[option.city], option)
		},500)

		function makeInfo(arr, option){
			var tmp
			var temp = []
			var weather = []

			for(var i = 0; i < arr.length; i ++){
				tmp = arr[i]
				temp.push((tmp.t1 || 0) + '℃~' + (tmp.t2 || 0) + '℃')
				weather.push(tmp.s1)
			}
			option.second = true

			that.setText({
				temp1: temp[0],
				temp2: temp[1],
				temp3: temp[2],
				temp4: temp[3],
				temp5: temp[4],
				img0: 0,
				weather1: weather[0],
				weather2: weather[1],
				weather3: weather[2],
				weather4: weather[3],
				weather5: weather[4]
			},option)
		}
	},
	setText : function(info, option){
		var time  = this.time();
		var index = option.index || 1;
		var temp = this.temp(info['temp' + index]);
		var num = option.second ? 0 : index * 2 - 1
		var arrIndex

		$('#nio-img').attr({'title': info['img_title' + num] || info['weather' + index], 'class': 'nio-' + (info['img' + num] || 0)});
		$('#nio-kv').css('background-image', 'url(images/index/uniqlo-bg/'+ (info['img' + num] || 0) + '.jpg)');
		$('#nio-city').text(option.city).attr('title', option.city);
		$('#nio-date').text(time[index - 1].year + '年' + time[index - 1].month + '月' + time[index - 1].date + '日');
		$('#nio-day').text(time[index - 1].day).attr('title', time[index - 1].day);
		$('#nio-wea').text(info['weather' + index]);
		$('#nio-low').html(temp.l);
		$('#nio-high').html(temp.h);

		if(temp.av >19){
			if(temp.av >= 29) arrIndex = 0
			else if(temp.av >= 24) arrIndex = 1
			else arrIndex = 2
		} else {
			if(temp.av >= 15) arrIndex = 3
			else if(temp.av >= 11) arrIndex = 4
			else if(temp.av >= 6) arrIndex = 5
			else arrIndex = 6
		}

		$('#nio-tip').text(this.tips[arrIndex]).attr('title', this.tips[arrIndex]);

		$('#nio-day1').text(time[0].day);
		$('#nio-day2').text(time[1].day);
		$('#nio-day3').text(time[2].day);
		$('#nio-day4').text(time[3].day);
		$('#nio-day5').text(time[4].day);
		$('#nio-day6').text(time[5].day);

		$('#nio-tem1').html(this.temp(info.temp1).h);
		$('#nio-tem2').html(this.temp(info.temp2).h);
		$('#nio-tem3').html(this.temp(info.temp3).h);
		$('#nio-tem4').html(this.temp(info.temp4).h);
		$('#nio-tem5').html(this.temp(info.temp5).h);
		$('#nio-tem6').html(this.temp(info.temp6).h);

		this[option.city] = info;
		if(typeof option.callback == 'function'){
			option.callback(option.province, temp, info);
		}
	},
	temp : function(str){
		var first, second, low = 0, high = 0;
		if(str){
			str = str.split('~');
			first = parseInt(str[0], 10),
			second = parseInt(str[1], 10),
			low = Math.min(first, second),
			high = Math.max(first, second);
		}

		return {
			l  : low + '&deg;',
			h : high + '&deg;',
			av : Math.ceil((low + high) / 2),
			low: low,
			high : high
		}
	},
	init : function(option){
		option = option || {}
		var city = option.city
		if(city === remote_ip_info['city'] && this[city]) return this.setText(this[city], option);
		city = remote_ip_info['city'] = city || remote_ip_info['city'];
		for (var i = 0, len = citys.length; i < len; i ++) {
			if(citys[i].n === city) break;
		}
		option.city = city
		if(citys[i]) this.ajax(citys[i].i, option);
		else {
			option.city = '上海'
			this.ajax(101020100, option)
		}
	}
};

weather.init();

/*=================================*/
// $.weather.init({
// 		city : city,
// 		callback: function(provice, temper, info){
// 			// province 省区名
// 			// temper: {
//			// 	low: 最低气温
//			// 	high: 最高气温
//			// }
// 			// info 整条info数据
// 		}
// })
/*=================================*/

$.weather = weather;

/*== mini-city ==*/

if(typeof data != 'undefined'){
	var sel = new LinkageSelect({data : data});
	sel.bind('.linkageselect .level_1');
	sel.bind('.linkageselect .level_2');
	sel.bind('.linkageselect .level_3');
}
var location = $('.mini-city');
$('.mini-change-btn').on('click', function(){
	location.toggle();
});

location.submit(function(){
	var that = $(this),
			option = that.find('option:checked'),
			province = option.first().text(),
			prov = province,
			city = option.last().text(),
			temp = city.slice(-1);

	if(city !== '请选择'){
		if(province !== '台湾省'){
			if( province === '香港' || province === '澳门'){
				city = province;
			} else {
				city = city.slice(0, (temp === '区' ? -2 : -1));
			}
		}
		$('#nio-tip').text('正在加载天气数据，请稍等...').attr('title', '正在加载天气数据，请稍等...');
		weather.init({'city' : city, 'province': prov});
		that.hide();
		$.uniqlo.index.togClass($.uniqlo.index.week.find('li').first(), 'mini-checked')

	} else alert('请选择城市！');
	return false;

}).on('click', 'a.mini-city-close', function(){
	location.hide();
});

});

// http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=1&city=