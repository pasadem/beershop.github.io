import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { addToCart } from "../slices/cartSlice";
import { discountCalc, discountHandler, weightHandler } from "../utils/priceHandlers";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productHandler = (product) => {
    if (product.category === "Yeast") {
      return (
        <>
          <Row>Тип бродіння - верхній</Row>
          <Row>Ідеальна температура бродіння: {product.ferment_temp}</Row>
        </>
      );
    } else if (product.category === "Hops") {
      return(
      <>
        <Row>Рік врожаю: {product.cropYear}</Row>
        <Row>Вміст альфа кислот: {product.alfa}</Row>
      </>
      )
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Назад
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Image src={product.image} alt={product.name} fluid />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>Ціна {discountHandler(product)}{weightHandler(product)}</Row>
                  <Row>Упаковка: {product.weight} кг</Row>
                  {productHandler(product)}
                  <Row>Виробник: {product.origin}</Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5>{product.name}</h5>
                </ListGroup.Item>
                {/* <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item> */}

                <ListGroup.Item>
                  Докладніше: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3} className="py-3">
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Ціна:</Col>

                      <Col>
                        <strong>{discountCalc(product)} грн</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col md={8}>Наявність товару</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <FcCheckmark />
                        ) : (
                          <FcCancel />
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Кількість</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Додати в кошик
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row></Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
