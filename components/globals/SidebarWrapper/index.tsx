import CartSideBar from '../../reusable/CartSideBar/CartSideBar';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxOverwriteHooks';
import { selectCartShowSideBar, setShowSideBar } from '../../../store/reducers/cartSlice';

const SidebarWrapper = () => {
    const dispatch = useAppDispatch();
    const sideBarShow = useAppSelector(selectCartShowSideBar);

    return sideBarShow ? <CartSideBar onBackDropPress={() => dispatch(setShowSideBar(false))} onClose={() => dispatch(setShowSideBar(false))} /> : <div />;
};

export default SidebarWrapper;
