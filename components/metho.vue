<template>
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8 font-sans">
    
    <!-- Section 1: QR Codes -->
    <div>
      <div v-if="qrCodes.length > 0" class="flex flex-wrap justify-center gap-4 sm:gap-8">
        <div v-for="qr in qrCodes" :key="qr.name" class="text-center">
          <img :src="qr.imgSrc" :alt="`${qr.name} QR Code`" class="w-40 h-40 object-cover rounded-lg shadow-md mx-auto" @error="handleImageError">
          <p class="mt-3 font-semibold text-gray-700">{{ qr.name }}</p>
        </div>
      </div>
    </div>

    <!-- Section 2: Sponsor Links -->
    <div class="mt-8">
      <div v-if="sponsorLinks.length > 0" class="flex flex-wrap justify-center items-center gap-4 py-4">
        <a v-for="link in sponsorLinks" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer" 
           :class="[
              'inline-flex items-center justify-center font-semibold px-5 py-2 rounded-full transition-colors duration-300',
              link.colorClasses
           ]">
          <i :class="[link.iconClass, 'w-5 h-5 mr-2']"></i>
          <span>{{ link.name }}</span>
        </a>
      </div>
    </div>

    <!-- Section 3: Ledger -->
    <div class="mt-8">
       <!-- Loading and Error States for Ledger -->
      <div v-if="isLoading" class="text-center py-10 text-gray-500">
        正在加载账目...
      </div>
      <div v-else-if="errorMsg" class="text-center py-10 text-red-500 font-semibold">
        {{ errorMsg }}
      </div>
       
       <!-- Ledger Content -->
      <div v-else>
        <!-- Header and main toggle -->
        <div class="flex items-center justify-between mb-6">
          <button @click="isLedgerExpanded = !isLedgerExpanded" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform duration-300" :class="{'rotate-180': isLedgerExpanded}">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <span class="font-semibold">{{ isLedgerExpanded ? '收起账簿' : '展开账簿' }}</span>
          </button>
        </div>

        <!-- Summary (always visible when collapsed) -->
        <div v-if="!isLedgerExpanded" class="transition-all duration-300">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div class="bg-green-100 text-green-800 p-3 rounded-lg"><span class="font-medium">总收入：</span><span class="font-bold text-lg">¥{{ formatCurrency(totalIncome) }}</span></div>
            <div class="bg-red-100 text-red-800 p-3 rounded-lg"><span class="font-medium">总支出：</span><span class="font-bold text-lg">¥{{ formatCurrency(totalExpense) }}</span></div>
            <div class="bg-yellow-100 text-yellow-800 p-3 rounded-lg"><span class="font-medium">总盈余：</span><span class="font-bold text-lg" :class="{'text-red-600': surplus < 0}">¥{{ formatCurrency(surplus) }}</span></div>
          </div>
        </div>

        <!-- Collapsible content (main ledger details) -->
        <div v-if="isLedgerExpanded" class="transition-all duration-300">
          <!-- Tabs -->
          <div class="flex border-b border-gray-200 mb-4">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['py-2 px-4 font-semibold outline-none transition-colors duration-200', activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700']">{{ tab.name }}</button>
          </div>
          
          <p v-if="activeTab !== 'expense'" class="text-sm text-gray-500 mb-4">如果你希望展示一个头像，可以联系我 (比如发头像链接给我)</p>

          <!-- Scrollable Area for Lists -->
          <div class="max-h-96 overflow-y-auto pr-2">
            <!-- Financial Sponsors Tab -->
            <div v-if="activeTab === 'financial'" class="space-y-1">
              <div class="hidden sm:grid grid-cols-12 gap-4 items-center px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                <div class="col-span-1 text-center">#</div>
                <div class="col-span-5">老板</div>
                <div class="col-span-3 text-center">¥ 总额</div>
                <div class="col-span-3 text-center">次数</div>
              </div>
              <div v-for="(sponsor, index) in financialSponsors" :key="sponsor.id" class="bg-gray-50 rounded-lg transition-colors duration-200 mb-2">
                <div @click="toggleDetails(sponsor.id)" class="grid grid-cols-12 gap-4 items-center hover:bg-gray-100 p-3 sm:px-4 sm:py-3 cursor-pointer">
                  <div class="col-span-1 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-1 text-gray-400 transition-transform', {'rotate-90': openDetails[sponsor.id]}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    {{ index + 1 }}
                  </div>
                  <div class="col-span-7 sm:col-span-5 min-w-0">
                      <div class="inline-flex items-center">
                          <img :src="sponsor.avatar || 'https://placehold.co/100x100/e2e8f0/adb5bd?text=?'" @error="handleImageError" class="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover border-2 border-white shadow" alt="avatar" />
                          <span class="font-semibold text-gray-800 truncate leading-none">{{ sponsor.name }}</span>
                      </div>
                  </div>
                  <div class="col-span-4 sm:col-span-3 text-center font-mono font-bold text-orange-500"><span class="sm:hidden text-xs text-gray-500 font-sans">总额: </span>¥{{ formatCurrency(sponsor.totalAmount) }}</div>
                  <div class="col-span-12 sm:col-span-3 text-center font-bold text-indigo-500"><span class="sm:hidden text-xs text-gray-500 font-sans">次数: </span>{{ sponsor.times }}</div>
                </div>
                <div v-if="openDetails[sponsor.id]" class="px-4 sm:px-8 pb-3 pt-1 border-t border-gray-200 bg-white">
                    <div class="grid grid-cols-3 gap-4 py-2 text-xs font-semibold text-gray-500">
                      <div class="col-span-1">日期</div><div class="col-span-1">方式</div><div class="col-span-1 text-right">金额</div>
                    </div>
                    <div v-for="(donation, dIndex) in sponsor.donations.filter(d => !otherMethods.includes(d.method))" :key="dIndex" class="grid grid-cols-3 gap-4 py-2 items-center border-b border-gray-100 last:border-b-0">
                      <div class="text-sm text-gray-600">{{ donation.date }}</div>
                      <div class="flex items-center text-sm">
                        <span v-html="methodMap[donation.method]?.svg" :style="{ color: methodMap[donation.method]?.color }" class="w-4 h-4 mr-2"></span>
                        <span class="text-gray-700">{{ methodMap[donation.method]?.title || '其他' }}</span>
                      </div>
                      <div class="text-sm text-right font-mono text-gray-700">¥{{ formatCurrency(donation.amount) }}</div>
                    </div>
                  </div>
              </div>
              <div v-if="financialSponsors.length === 0" class="text-center py-10 text-gray-500">暂无经济赞助记录</div>
            </div>
            
            <!-- Other Sponsors Tab -->
            <div v-else-if="activeTab === 'other'" class="space-y-1">
              <div class="hidden sm:grid grid-cols-12 gap-4 items-center px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                <div class="col-span-1 text-center">#</div>
                <div class="col-span-5">老板</div>
                <div class="col-span-3 text-center">¥ 总额</div>
                <div class="col-span-3 text-center">次数</div>
              </div>
              <div v-for="(sponsor, index) in otherSponsors" :key="sponsor.id" class="bg-gray-50 rounded-lg transition-colors duration-200 mb-2">
                <div @click="toggleDetails(sponsor.id)" class="grid grid-cols-12 gap-4 items-center hover:bg-gray-100 p-3 sm:px-4 sm:py-3 cursor-pointer">
                  <div class="col-span-1 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-1 text-gray-400 transition-transform', {'rotate-90': openDetails[sponsor.id]}]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    {{ index + 1 }}
                  </div>
                  <div class="col-span-7 sm:col-span-5 min-w-0">
                      <div class="inline-flex items-center">
                          <img :src="sponsor.avatar || 'https://placehold.co/100x100/e2e8f0/adb5bd?text=?'" @error="handleImageError" class="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover border-2 border-white shadow" alt="avatar" />
                          <span class="font-semibold text-gray-800 truncate leading-none">{{ sponsor.name }}</span>
                      </div>
                  </div>
                  <div class="col-span-4 sm:col-span-3 text-center font-mono font-bold text-orange-500"><span class="sm:hidden text-xs text-gray-500 font-sans">总额: </span>¥{{ formatCurrency(sponsor.totalAmount) }}</div>
                  <div class="col-span-12 sm:col-span-3 text-center font-bold text-indigo-500"><span class="sm:hidden text-xs text-gray-500 font-sans">次数: </span>{{ sponsor.times }}</div>
                </div>
                <div v-if="openDetails[sponsor.id]" class="px-4 sm:px-8 pb-3 pt-1 border-t border-gray-200 bg-white">
                    <div class="grid grid-cols-3 gap-4 py-2 text-xs font-semibold text-gray-500">
                      <div class="col-span-1">日期</div><div class="col-span-1">方式</div><div class="col-span-1 text-right">金额</div>
                    </div>
                    <div v-for="(donation, dIndex) in sponsor.donations.filter(d => otherMethods.includes(d.method))" :key="dIndex" class="grid grid-cols-3 gap-4 py-2 items-center border-b border-gray-100 last:border-b-0">
                      <div class="text-sm text-gray-600">{{ donation.date }}</div>
                      <div class="flex items-center text-sm">
                        <span v-html="methodMap[donation.method]?.svg" :style="{ color: methodMap[donation.method]?.color }" class="w-4 h-4 mr-2"></span>
                        <span class="text-gray-700">{{ methodMap[donation.method]?.title || '其他' }}</span>
                      </div>
                      <div class="text-sm text-right font-mono text-gray-700">¥{{ formatCurrency(donation.amount) }}</div>
                    </div>
                  </div>
              </div>
              <div v-if="otherSponsors.length === 0" class="text-center py-10 text-gray-500">暂无其他赞助记录</div>
            </div>

            <!-- Expense Tab -->
            <div v-else-if="activeTab === 'expense'" class="space-y-2">
              <div class="hidden sm:grid grid-cols-12 gap-4 items-center px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                <div class="col-span-4">日期</div><div class="col-span-5">项目</div><div class="col-span-3 text-right">金额</div>
              </div>
              <div v-for="item in expenses" :key="item.id" class="grid grid-cols-12 gap-4 items-center bg-gray-50 p-3 rounded-lg">
                 <div class="col-span-6 sm:col-span-4 text-sm text-gray-600">{{ item.date }}</div>
                 <div class="col-span-6 sm:col-span-5 font-medium text-gray-800">{{ item.item }} <span v-if="item.remarks" class="text-xs text-gray-400">({{ item.remarks }})</span></div>
                 <div class="col-span-12 sm:col-span-3 text-right font-mono text-red-500">-¥{{ formatCurrency(item.amount) }}</div>
              </div>
              <div v-if="expenses.length === 0" class="text-center py-10 text-gray-500">暂无支出记录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// --- 类型定义 (合并) ---
interface QrCode {
  name: string;
  imgSrc: string;
}
interface SponsorLink {
  name: string;
  url: string;
  iconClass: string;
  colorClasses: string;
}
interface Donation { date: string; amount: number; method: string; }
interface SponsorSource { id: number; name:string; avatar?: string; donations: Donation[]; }
interface Expense { id: number; date: string; item: string; amount: number; remarks?: string; }
interface ProcessedSponsor extends SponsorSource { totalAmount: number; times: number; }
interface Method { svg: string; color: string; title: string; }
interface Tab { id: string; name: string; }


// --- 赞助方式组件的状态 ---
const qrCodes = ref<QrCode[]>([
  { name: '支付宝', imgSrc: 'alipay.png' },
  { name: '微信支付', imgSrc: 'wx.png' },
  { name: 'QQ钱包', imgSrc: 'qq.png' },
]);
const sponsorLinks = ref<SponsorLink[]>([
  { name: '通过爱发电赞助我', url: 'https://afdian.com/a/BH2VSQ', iconClass: 'i-ri-flashlight-line', colorClasses: 'text-purple-600 border-purple-500 hover:bg-purple-600 hover:text-white' },
  { name: '为我充电', url: 'https://space.bilibili.com/188510837', iconClass: 'i-ri-battery-charge-line', colorClasses: 'text-pink-500 border-pink-400 hover:bg-pink-500 hover:text-white' }
]);


// --- 账簿组件的状态 ---
const isLedgerExpanded = ref(false); // **默认设为折叠**
const openDetails = ref<Record<number, boolean>>({});
const tabs = ref<Tab[]>([{ id: 'financial', name: '经济赞助' },{ id: 'other', name: '其他赞助' },{ id: 'expense', name: '当前支出' }]);
const activeTab = ref<string>('financial');
const sponsors = ref<SponsorSource[]>([]);
const expenses = ref<Expense[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');


// --- 数据获取 ---
onMounted(async () => {
  // 从 public 文件夹获取数据
  const sponsorUrl = '/sponsor.json';
  const expenseUrl = '/walletpay.json';

  try {
    const [sponsorResponse, expenseResponse] = await Promise.all([
      fetch(sponsorUrl),
      fetch(expenseUrl)
    ]);

    if (!sponsorResponse.ok) throw new Error(`无法获取 sponsor.json`);
    if (!expenseResponse.ok) throw new Error(`无法获取 walletpay.json`);

    sponsors.value = await sponsorResponse.json();
    expenses.value = await expenseResponse.json();
  } catch (error) {
    console.error("加载本地JSON失败:", error);
    errorMsg.value = '无法加载账目数据。';
  } finally {
    isLoading.value = false;
  }
});


// --- 账簿组件的计算属性和方法 ---
const otherMethods = ['AFDIAN', 'BILIBILI'];
const methodMap: Record<string, Method> = {
  ALI_PAY: { svg: `<svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M856.5 448.4H223.4c-13.2 0-24.1 10.8-24.1 24.1v102.8c0 13.3 10.8 24.1 24.1 24.1h633.1c13.3 0 24.1-10.8 24.1-24.1V472.5c0-13.3-10.8-24.1-24.1-24.1zM343.8 393.1h336.3c13.3 0 24.1-10.8 24.1-24.1V266.2c0-13.3-10.8-24.1-24.1-24.1H343.8c-13.3 0-24.1 10.8-24.1 24.1v102.8c0 13.3 10.8 24.1 24.1 24.1zM897 128H127C74.5 128 32 170.5 32 223v578c0 52.5 42.5 95 95 95h770c52.5 0 95-42.5 95-95V223c0-52.5-42.5-95-95-95zm-111.4 610.1H238.3c-13.3 0-24.1-10.8-24.1-24.1V672.4c0-13.3 10.8-24.1 24.1-24.1h547.3c13.3 0 24.1 10.8 24.1 24.1v41.6c0 13.3-10.8 24.1-24.1 24.1z"></path></svg>`, color: '#00A3EE', title: '支付宝' },
  WECHAT_PAY: { svg: `<svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M798 224H226c-33 0-60 27-60 60v448c0 33 27 60 60 60h572c33 0 60-27 60-60V284c0-33-27-60-60-60zm-33.6 448.3H259.6c-4.6 0-8.3-3.7-8.3-8.3V312.4c0-4.6 3.7-8.3 8.3-8.3h504.8c4.6 0 8.3 3.7 8.3 8.3v351.6c0 4.6-3.7 8.3-8.3 8.3z"></path><path fill="currentColor" d="M336 440c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm352 0c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zM512 576c-101.7 0-184 82.3-184 184h368c0-101.7-82.3-184-184-184z"></path></svg>`, color: '#2DC100', title: '微信支付' },
  BILIBILI: { svg: `<svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M301.9 443.3c-23.2 0-41.9-18.8-41.9-41.9s18.8-41.9 41.9-41.9 41.9 18.8 41.9 41.9-18.7 41.9-41.9 41.9zm420.2 0c-23.2 0-41.9-18.8-41.9-41.9s18.8-41.9 41.9-41.9 41.9 18.8 41.9 41.9-18.8 41.9-41.9 41.9zM888 296H136c-17.7 0-32 14.3-32 32v496c0 17.7 14.3 32 32 32h752c17.7 0 32-14.3 32-32V328c0-17.7-14.3-32-32-32zm-48 496H184V360h656v432zM512 623.1c-66.2 0-119.8 53.6-119.8 119.8h239.6c0-66.2-53.6-119.8-119.8-119.8z"></path></svg>`, color: '#FB7299', title: '哔哩哔哩' }
};

const createSponsorList = (filterFn: (donation: Donation) => boolean) => {
  if (!Array.isArray(sponsors.value)) return [];
  const sponsorMap: Record<number, ProcessedSponsor> = {};
  sponsors.value.forEach(s => {
    const relevantDonations = s.donations.filter(filterFn);
    if (relevantDonations.length > 0) {
      if (!sponsorMap[s.id]) sponsorMap[s.id] = { ...s, donations: [], totalAmount: 0, times: 0 };
      sponsorMap[s.id].donations.push(...relevantDonations);
    }
  });
  return Object.values(sponsorMap).map(s => {
    s.totalAmount = s.donations.reduce((sum, d) => sum + d.amount, 0);
    s.times = s.donations.length;
    return s;
  }).sort((a, b) => b.totalAmount - a.totalAmount);
};

const financialSponsors = computed(() => createSponsorList(d => !otherMethods.includes(d.method)));
const otherSponsors = computed(() => createSponsorList(d => otherMethods.includes(d.method)));

const totalIncome = computed<number>(() => {
    if (!Array.isArray(sponsors.value)) return 0;
    return sponsors.value.reduce((total, s) => total + s.donations.reduce((sum, d) => sum + d.amount, 0), 0);
});
const totalExpense = computed<number>(() => {
    if (!Array.isArray(expenses.value)) return 0;
    return expenses.value.reduce((sum, item) => sum + item.amount, 0);
});
const surplus = computed<number>(() => totalIncome.value - totalExpense.value);

const toggleDetails = (id: number) => { openDetails.value[id] = !openDetails.value[id]; };
const formatCurrency = (value: number): string => (typeof value !== 'number' ? '0.00' : value.toFixed(2));
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    target.src = 'https://placehold.co/200x200/f0f0f0/999999?text=Error';
    target.onerror = null;
};
</script>

<style scoped>
.font-sans {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}
[class^="i-"], [class*=" i-"] {
  display: inline-block;
  vertical-align: middle;
}
</style>
