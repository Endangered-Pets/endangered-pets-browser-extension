var debug = !1,
	goodieInterval = void 0,
	helper = {
		getStorage: function ()
		{
			return new Promise(function (e, t)
			{
				chrome.storage.local.get("pet", function (o)
				{
					debug && console.log("getStorage ", o.pet), void 0 !== o.pet ? e(o.pet) : t(
					{
						hp: 100,
						goodieLevel: 0,
						goodieStage: 0,
						goodieTimestamp: 0,
						pet: "",
						petStatus: "",
						tabCount: 0
					})
				})
			})
		},
		setStorage: function (e)
		{
			var t = {
				pet: e
			};
			return debug && console.log("endangered-pet setStorage", t), new Promise(function (e, o)
			{
				try
				{
					chrome.storage.local.set(t, function ()
					{
						e("local storage set")
					})
				}
				catch (e)
				{
					o("local storage not set - error occurred.")
				}
			})
		},
		initialTabCount: function ()
		{
			return new Promise(function (e, t)
			{
				debug && console.log("in initialTabCount"), chrome.tabs.query(
				{}, function (o)
				{
					void 0 === typeof o ? (debug && console.log("in initialTabCount reject"), t()) : (debug && console.log("in initialTabCount resolve", o.length), e(--o.length))
				})
			})
		},
		setStateText: function (e)
		{
			var t = [],
				o = Math.floor(3 * Math.random());
			100 === e.hp ? e.petStatus = '"Yippee!"' : e.hp <= 99 && e.hp >= 80 ? (t = ['"Oh yeah!"', '"So happy!"', '"Hi! Hello! Hi!"'], e.petStatus = t[o]) : e.hp <= 79 && e.hp >= 60 ? (t = ['"You are the best!"', '"Life is good!"', '"<3"'], e.petStatus = t[o]) : e.hp <= 59 && e.hp >= 40 ? (t = ['"Hmph!"', '"Too. Many. Tabs."', '"Please close tabs."'], e.petStatus = t[o]) : e.hp <= 39 && e.hp >= 20 ? (t = ['"So mad at you!"', '"%(*$&%&"', '"Argh!"'], e.petStatus = t[o]) : e.hp <= 19 && e.hp >= 1 ? (t = ['"Feeling sick..."', '"Slipping away..."', '"Stomachache..."'], e.petStatus = t[o]) : e.hp <= 0 && (e.petStatus = '"R.I.P."')
		},
		item: function (e, t)
		{
			var o = [e.item.item1, e.item.item2, e.item.item3, e.item.item4, e.item.item5, e.item.item6],
				s = [];
			o.forEach(function (e)
			{
				e.style.display = "none"
			}), t.goodieLevel > 0 && o.forEach(function (e)
			{
				e.classList.add("color")
			}), t.hp <= 59 && t.hp >= 40 ? s = o.slice(0, 1) : t.hp <= 39 && t.hp >= 20 ? s = o.slice(0, 3) : t.hp <= 19 && t.hp >= 1 && (s = o), s.forEach(function (e)
			{
				e.style.display = "block"
			})
		},
		setRandomAsset: function (e, t)
		{
			var o = Math.floor(3 * Math.random()),
				s = {
					state1: ["../../assets/idle-pangolin.gif"],
					state2: ["../../assets/idle-pangolin.gif"],
					state3: ["../../assets/idle-pangolin.gif"],
					state4: ["../../assets/idle-pangolin.gif"],
					state5: ["../../assets/dead-pangolin.gif"],
					state6: ["../../assets/dead-pangolin.gif"]
				};
			100 === t.hp ? e.pet.src = s.state1[o] : t.hp <= 99 && t.hp >= 80 ? e.pet.src = s.state1[o] : t.hp <= 79 && t.hp >= 60 ? e.pet.src = s.state2[o] : t.hp <= 59 && t.hp >= 40 ? e.pet.src = s.state3[o] : t.hp <= 39 && t.hp >= 20 ? e.pet.src = s.state4[o] : t.hp <= 19 && t.hp >= 1 ? e.pet.src = s.state5[o] : t.hp <= 0 && (e.pet.src = s.state6[o])
		},
		handleGoodieTimer: function (e, t)
		{
			var o = Date.now(),
				s = o - t.goodieTimestamp >= 36e5,
				l = e.goodieUISegments;
			if (debug && console.log(o, t.goodieTimestamp, s, typeof goodieInterval), t.tabCount > 5)
			{
				debug && console.log("cannot start goodie timer, too many tabs");
				for (var n = 0; n < l.length; n++) l[n].classList.remove("toggle");
				helper.clearGoodieTimer()
			}
			else t.tabCount < 6 && void 0 === goodieInterval && s && (goodieInterval = setInterval(function ()
			{
				t.goodieStage < 10 && t.goodieLevel < 2 ? (t.goodieStage++, t.goodieTimestamp = Date.now()) : 10 === t.goodieStage && t.goodieLevel < 2 ? (t.goodieStage = 0, t.goodieLevel++, t.goodieTimestamp = Date.now()) : 2 === t.goodieLevel && (t.goodieStage = 10), helper.updateGoodieUI(e, t), debug && console.log("goodie timer started", goodieInterval, t)
			}, 36e5))
		},
		updateGoodieUI: function (e, t)
		{
			var o = t.goodieLevel,
				s = t.goodieStage,
				l = e.goodieUISegments;
			if (0 === s && o < 2)
			{
				for (var n = 0; n < l.length; n++) l[n].classList.remove("on"), l[n].classList.remove("toggle"), l[n].classList.add("off");
				l[0].classList.add("toggle")
			}
			else
			{
				for (var a = 0; a < s; a++) l[a].classList.remove("off"), l[a].classList.remove("toggle"), l[a].classList.add("on");
				if (s < 10 && l[s].classList.add("toggle"), debug && console.log("goodie stage is " + t.goodieStage), 10 === s && o < 2)
					for (var i = 0; i < l.length; i++) l[i].classList.add("toggle")
			}
			e.goodieSilhouettes.classList.remove("level-0"), e.goodieSilhouettes.classList.remove("level-1"), e.goodieSilhouettes.classList.add("level-" + t.goodieLevel), helper.setUI(e, t), helper.setStorage(t).then(function (e)
			{
				debug && console.log(e)
			}).catch(function (e)
			{
				debug && console.log(e)
			})
		},
		setGoodieGif: function (e, t)
		{
			var o = e.pet;
			0 === t.goodieLevel ? o.src = "../../assets/goodie/level-1-goodie.gif" : 1 === t.goodieLevel && (o.src = "../../assets/goodie/level-2-goodie.gif")
		},
		clearGoodieTimer: function ()
		{
			clearInterval(goodieInterval), goodieInterval = void 0
		},
		setUI: function (e, t)
		{
			var o = t.hp <= 0 ? 0 : t.hp;
			debug && console.log("setUI", t), e.goodieState.innerText = t.goodieStage + "/10", e.hpProgressBar.style.width = o + "%", e.hpState.innerText = o + "/100", e.petStatus.innerText = "" + t.petStatus, e.tabCount.innerText = "You have " + t.tabCount + " tabs open", helper.setStateText(t), helper.setRandomAsset(e, t), helper.item(e, t), helper.setStorage(t).then(function (e)
			{
				debug && console.log(e)
			}).catch(function (e)
			{
				debug && console.log(e)
			})
		}
	};
document.addEventListener("DOMContentLoaded", function ()
{
	var e, t = {
		body: document.getElementById("endangered-pet"),
		preloader: document.getElementById("preloader-container"),
		goodieState: document.getElementById("goodie-state"),
		goodieUISegments: document.querySelectorAll(".goodie-segment"),
		goodieSilhouettes: document.getElementById("goodie-silhouettes"),
		hpProgressBar: document.getElementById("hp-indicator"),
		hpState: document.getElementById("hp-indicator-text"),
		item:
		{
			item1: document.getElementById("item-1"),
			item2: document.getElementById("item-2"),
			item3: document.getElementById("item-3"),
			item4: document.getElementById("item-4"),
			item5: document.getElementById("item-5"),
			item6: document.getElementById("item-6")
		},
		pet: document.querySelector("#pet a img"),
		petStatus: document.getElementById("pet-text"),
		tabCount: document.getElementById("tab-count"),
		tips: document.querySelectorAll(".tip"),
		tipModals:
		{
			goodie: document.getElementById("goodie-tip"),
			health: document.getElementById("health-tip"),
			pet: document.getElementById("pet-tip")
		}
	};
	helper.getStorage().then(function (t)
	{
		e = t
	}).catch(function (t)
	{
		e = t
	}).then(function ()
	{
		helper.initialTabCount().then(function (o)
		{
			e.tabCount = o, e.hp = 100 - 4 * e.tabCount, helper.updateGoodieUI(t, e), helper.handleGoodieTimer(t, e), helper.setUI(t, e), t.preloader.style.display = "none"
		}).catch(function (o)
		{
			helper.handleGoodieTimer(t, e), helper.setUI(t, e), t.preloader.style.display = "none"
		})
	}), chrome.tabs.onCreated.addListener(function ()
	{
		++e.tabCount, e.hp = 100 - 4 * e.tabCount, helper.updateGoodieUI(t, e), helper.handleGoodieTimer(t, e), helper.setUI(t, e)
	}), chrome.tabs.onRemoved.addListener(function ()
	{
		--e.tabCount, e.hp = 100 - 4 * e.tabCount, helper.updateGoodieUI(t, e), helper.handleGoodieTimer(t, e), helper.setUI(t, e)
	}), t.pet.addEventListener("click", function (e)
	{
		e.preventDefault(), t.pet.style.marginTop = "-50px", setTimeout(function ()
		{
			t.pet.style.marginTop = "0px"
		}, 250)
	}), t.tips.forEach(function (e)
	{
		e.addEventListener("click", function (e)
		{
			e.preventDefault()
		}), e.addEventListener("mouseenter", function (e)
		{
			e.preventDefault();
			var o = e.currentTarget;
			o.classList.contains("transition") || (o.classList.contains("goodie") ? t.tipModals.goodie.style.display = "block" : o.classList.contains("health") ? t.tipModals.health.style.display = "block" : t.tipModals.pet.style.display = "block", o.classList.add("transition"))
		}), e.addEventListener("mouseleave", function (e)
		{
			e.preventDefault();
			var o = e.currentTarget;
			o.classList.contains("goodie") ? t.tipModals.goodie.style.display = "none" : o.classList.contains("health") ? t.tipModals.health.style.display = "none" : t.tipModals.pet.style.display = "none", o.classList.remove("transition")
		})
	})
});
