import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axiosInstance from '@/utils/interceptors';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';

const DeleteProduct = ({ productId }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useUserContext();

    const hasDeletePermission = () => {
        if (user) {
            if (user.role === 'ADMIN') {
                return true; // 삭제 권한 있음
            }
        }
        return false; // 삭제 권한 없음
    };

    // 삭제 처리
    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/api/admin/product/${productId}`);
            alert('상품이 성공적으로 삭제되었습니다.');
            navigate('/home'); // 상품 목록 페이지로 이동
        } catch (error) {
            console.error('상품 삭제 중 오류 발생:', error);
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    if (!hasDeletePermission()) {
        return null; // 권한이 없으면 아무것도 렌더링하지 않음
    }

    return (
        <>
            
            <Button 
                variant="danger"
                onClick={() => setShowModal(true)}
                className="ms-2"
            >
                상품 삭제
            </Button>


            <Modal 
                show={showModal} 
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>상품 삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    정말로 이 상품을 삭제하시겠습니까?
                    이 작업은 되돌릴 수 없습니다.
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowModal(false)}
                    >
                        취소
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteProduct;
