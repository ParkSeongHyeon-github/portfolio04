import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SelectOne } from './api/table-api';

import Header from './components/Header';
import Main from './components/main/Main';
import Register from './member/Register';
import Login from './member/Login';
import Footer from './components/Footer';

import Admin from './admin/Admin';
import ProductWrite from './admin/ProductWrite';
import ProductList from './admin/ProductList';
import CategoryWrite from './admin/CategoryWrite';
import CategoryList from './admin/CategoryList';
import OrderList from './admin/OrderList';
import OrderView from './admin/OrderView';
import AdminRoute from './components/AdminRoute';

import StoreList from './page/StoreList';
import StoreView from './page/StoreView';
import PaySuccess from './page/PaySuccess';
import PayFail from './page/PayFail';

import type { RegisterProps } from './types/member-type';

import "./css/default.css";
import "./css/common.css";

function App() {
  const queryClient = new QueryClient();

  const [mbId, setMbId] = useState<string>('');
  const [mbData, setMbData] = useState<RegisterProps | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const mb_id = localStorage.getItem("mb_id");
    if (!mb_id) return;
    setReady(true);
    setMbId(mb_id);
    const load = async () => {
      try {
        const result = await SelectOne({ memberId: mb_id }, "member");
        setMbData(result[0]);
      } catch {
        alert("올바른 접근이 아닙니다.");
      }
    };
    load();
  }, [mbId]);

  return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Header
            setMbId={setMbId} 
            mbData={mbData}
            setMbData={setMbData}
            setReady={setReady}
          />
          <main>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setMbId={setMbId} />} />
              <Route element={<AdminRoute mbData={mbData} ready={ready} />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/product/write" element={<ProductWrite />} />
                <Route path="/admin/product/write/:product_id" element={<ProductWrite />} />
                <Route path="/admin/product/list" element={<ProductList />}></Route>
                <Route path="/admin/category/write" element={<CategoryWrite />} />
                <Route path="/admin/category/write/:cate_id" element={<CategoryWrite />} />
                <Route path="/admin/category/list" element={<CategoryList />} />
                <Route path="/admin/order/list" element={<OrderList />}></Route>
                <Route path="/admin/order/view/:order_id" element={<OrderView />}></Route>
              </Route>
              <Route path="/store/list" element={<StoreList />}></Route>
              <Route path="/store/view/:store_id" element={<StoreView />}></Route>
              <Route path="/pay/success" element={<PaySuccess />}></Route>
              <Route path="/pay/fail" element={<PayFail />}></Route>
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </QueryClientProvider>
    );
}

export default App;