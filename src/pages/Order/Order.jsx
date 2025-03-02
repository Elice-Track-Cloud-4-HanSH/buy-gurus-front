import { React, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, Row, Col, Button,Image, Collapse, Modal, Container, Badge } from "react-bootstrap";
import {OrderResponse} from "@/objects/OrderResponse";
import Pagenation from "@/components/Pagenation";
import Header from "@/components/Header";
import axiosInstance from "@/utils/interceptors";

const Order = () => {
  const [urlSearchParams] = useSearchParams();
  const type = urlSearchParams.get("type");
  return (
    <div>
      <Header />
      <OrderedItemList type={type === "c" ? "c" : "s"} />
    </div>
  )
}

const OrderedItemList = ({ type }) => {
  const [ orders, setOrders ] = useState([]);
  const [ totalPage, setTotalPage ] = useState(1);
  const [ loading, setLoading ] = useState(true);
  const [ deleteFlag, setDeleteFlag ] = useState(true);
  const [ showDeleteModal, setShowDeleteModal ] = useState(false);
  const [ page, setPage ] = useState(1);
  const [ deleteOrderId, setDeleteOrderId ] = useState(0);

  useEffect(() => {
    axiosInstance.get(`/api/order`, { 
      params: { type, page },
      withCredentials: true
    })
      .then(response => {
        const data = response.data.data;
        setTotalPage(data.pages === 0 ? 0 : data.pages);
        setOrders(data.orderList.map(order => new OrderResponse(order)));

        if (data.pages !== 0 && page > data.pages) {
          setPage(data.pages);
        }
        setLoading(false);
      })
      .catch(err => {
        const errorMessage = `${err.response?.data?.code}: ${err.response?.data?.message}`;
        console.log(errorMessage || 'An error occurred');
      });
  }, [type, page, deleteFlag]);

  const pageChangeHandler = (page) => {
    setPage(page);
  }

  const deleteOrder = (orderId) => {
    axiosInstance.delete(`/api/order/${orderId}`, {
        withCredentials: true
      })
      .then((response) => {
        setDeleteFlag(!deleteFlag);
      })
      .catch(error => {
        console.log(`HTTP error! status: ${error.response?.status}`);
      });
  }

  const deleteOrderHandler = () => {
    deleteOrder(deleteOrderId);
    closeModalHandler();
  }

  const deleteBtnClickHandler = (e, order) => {
    e.preventDefault()
    setDeleteOrderId(order.orderId);
    setShowDeleteModal(true);
  }

  const closeModalHandler = () => {
    setShowDeleteModal(false);
  }

  return (
    
      <Container className="py-4" style={{ margin: '0 auto', width: '100%', maxWidth: "600px", minWidth: "600px"}}>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom d-flex align-items-center p-3">
            <h5 className="mb-0">
              {type === "s" ? (
                <Badge bg="info" className="fs-6 py-2 px-3">판매 내역</Badge>
              ) : (
                <Badge bg="primary" className="fs-6 py-2 px-3">주문 내역</Badge>
              )}
            </h5>
          </Card.Header>
          <Card.Body className="p-3">
            {
              (orders.length > 0) && !loading && 
              <>
                <ul style={{ listStyleType: "none", paddingLeft: 0}}>
                { 
                  !loading && orders.map((order) => {
                    const orderList = order.orderInfoList
                    return (
                      <li key={order.orderId} style={{ marginBottom: '15px', textDecoration: 'none' }}>
                        <Link to={`/order/${order.orderId}`} className="text-decoration-none">
                          <Card>
                            <Card.Header>
                              <div className="d-flex justify-content-between align-items-start">
                                <h4>{order.status}</h4>
                                { type === "c" && order.status !== "준비중" && <Button variant="outline-secondary"
                                  className="btn x-button"
                                  size="sm"
                                  onClick={(e) => deleteBtnClickHandler(e, order)}
                                >X</Button> }
                              </div>
                              <small className="text-muted">{order.createdAt}</small>
                            </Card.Header>
                            <Card.Body>
                              <MultipleItemLayout items={orderList} shippingFee={order.shippingFee} />
                            </Card.Body>
                          </Card>
                        </Link>
                      </li>
                    )
                  })
                }
                </ul>
                <DeleteModal showModal={showDeleteModal} handleCloseModal={closeModalHandler} handleDeleteButton={deleteOrderHandler}/>
                <Pagenation totalPage={totalPage} changeHandler={pageChangeHandler}/>
              </>
            } 
          </Card.Body>
        </Card>
      </Container>
  )
}

const DeleteModal = ({ showModal, handleCloseModal, handleDeleteButton }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} aria-labelledby="exampleModalLabel">
      <Modal.Body>
        <p>구매 내역이 삭제됩니다.</p>
        <p>삭제된 구매 내역은 복구되지 않습니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>닫기</Button>
        <Button variant="danger" onClick={handleDeleteButton}>삭제</Button>
      </Modal.Footer>
    </Modal>
  )
}

const OrderedItem = ({ item }) => {
  return (
    <Row className="border p-2 rounded mx-0">
      <Col xs={2}>
        <Image src={item?.imageUrl || ""} fluid />
      </Col>
      <Col>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <strong>이름</strong><p className="mb-1">{item?.name}</p>
            <strong>가격</strong><p className="mb-1">{(item?.price * item?.quantity).toLocaleString()}원</p>
          </div>
        </div>
      </Col>
    </Row>
  )
}

const MultipleItemLayout = ({ items, shippingFee }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  }
  const mainOrder = items[0];
  const additionalOrder = items.slice(1);

  const totalPrice = items.map(item => item.price * item.quantity).reduce((prev, curr) => curr+prev, 0) + shippingFee;

  return (
    <>
      <Card.Body className="p-0">
        <p><strong>총액: </strong>{totalPrice.toLocaleString()}원</p>
      </Card.Body>
      <OrderedItem item={mainOrder} />
      {
        items.length > 1 && <>
          <Collapse in={isExpanded}>
            <div>
              { additionalOrder.map((order, idx) => <OrderedItem key={idx} item={order} />) }
            </div>
          </Collapse>
          <Button 
              variant="outline-secondary" 
              onClick={toggleExpand} 
              className="w-100"
          >
            {isExpanded ? '접기' : `${additionalOrder.length}개 더 보기`}
          </Button>
        </>
      }
    </>
  )
}

export default Order;