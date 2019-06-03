const DOMContentLoadedCallback = () => {
    const tabAElements = document.getElementsByClassName('tab-a');
    for (tabAElement of tabAElements) {
        tabAElement.addEventListener('click', (e) => {
            const activeTab = document.getElementsByClassName('active-a')[0];
            const activeTabContent = document.getElementsByClassName('tab-active')[0];
            activeTab.classList.remove('active-a');
            activeTabContent.classList.remove('tab-active');
            e.target.classList.add('active-a');
            document.querySelector(`.tab[data-id='${e.target.getAttribute('data-id')}']`).classList.add('tab-active');
        });
    }
};

document.addEventListener('DOMContentLoaded', DOMContentLoadedCallback, false);
