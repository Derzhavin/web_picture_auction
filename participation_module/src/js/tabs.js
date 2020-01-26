import "../less/tabs.less"

export function setupTabs() {
    let showTab = (li) => $(li).css('fontWeight', 'bold');
    let hideTab = (li) => $(li).css('fontWeight', '');

    $(".tabs").tabs({events: "mouseover", active: 1});

    let lis = $("li").get();
    lis.forEach(li => li.onclick = () => {
        lis.forEach(liAgain => hideTab($(liAgain)));
        showTab($(li))
    });

    showTab($('li[name="arts"]'));
}