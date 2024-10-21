import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useUserContext } from '../../../context/UserContext';

const ProductManagement = () => {
    const { user } = useUserContext();

    // userInfo가 null이거나 로딩 중일 때 처리
    if (!user) {
        return <div>Loading...</div>; // 또는 다른 로딩 표시
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">buy-Gurus</Navbar.Brand>
            <Nav className="me-auto">
                {user.role === 'ADMIN' && (
                    <Nav.Link href="#category-management">카테고리 관리</Nav.Link>
                )}
                {(user.role === 'ADMIN' || user.role === 'SELLER') && (
                    <Nav.Link href="#product-registration">상품 등록</Nav.Link>
                )}
            </Nav>
        </Navbar>
    );
};

export default ProductManagement;